import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Navigate, useLocation } from 'react-router';
import { z } from 'zod';

import { paths } from '@/config/paths';
import { RegisterResponse, LoginResponse, User } from '@/types/api';

import { api } from './api-client';

/* ____________________User____________________ */
const getCurrentUser = async (): Promise<{ data: User | null }> => {
  return api.get('/users/me');
};

export const useCurrentUser = () => {
  const token = localStorage.getItem('accessToken');

  return useQuery({
    enabled: !!token,
    queryKey: ['user'],
    queryFn: getCurrentUser,
  });
};

/* ____________________Logout____________________ */
const logout = async (): Promise<void> => {
  localStorage.removeItem('accessToken');
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(['user'], null);
      queryClient.setQueryData(['user-login'], null);
      window.location.href = paths.auth.login.getHref();
    },
  });
};

/* ____________________Login____________________ */
export const loginInputSchema = z.object({
  email: z.string().min(5, 'Required').email('Invalid email'),
  password: z.string().min(1, 'Required'),
});
export type LoginInput = z.infer<typeof loginInputSchema>;

const loginWithEmailAndPassword = (
  data: LoginInput,
): Promise<LoginResponse> => {
  return api.post('/auth/login', data);
};

type UseLoginOptions = {
  onSuccess?: (data: LoginResponse) => void;
};

export const useLogin = ({ onSuccess }: UseLoginOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['login'],
    mutationFn: loginWithEmailAndPassword,

    onSuccess: (response) => {
      if (response.data?.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
      }
      queryClient.setQueryData(['user-login'], response);
      onSuccess?.(response);
    },
  });
};

/* ____________________Register____________________ */
export const registerInputSchema = z.object({
  username: z.string().min(1, 'Required'),
  email: z.string().min(3, 'Required'),
  password: z.string().min(5, 'Required'),
});
export type RegisterInput = z.infer<typeof registerInputSchema>;

const registerWithEmailAndPassword = (
  data: RegisterInput,
): Promise<RegisterResponse> => {
  return api.post('/auth/register', data);
};

type UseRegisterOptions = {
  onSuccess?: (data: RegisterResponse) => void;
};

export const useRegister = ({ onSuccess }: UseRegisterOptions = {}) => {
  return useMutation({
    mutationFn: registerWithEmailAndPassword,
    onSuccess: (response) => {
      onSuccess?.(response);
    },
  });
};

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useCurrentUser();
  const location = useLocation();

  if (!user.data) {
    return (
      <Navigate to={paths.auth.login.getHref(location.pathname)} replace />
    );
  }

  return children;
};

/* ____________________AuthLoader____________________ */
type AuthLoaderProps = {
  children: React.ReactNode;
  renderLoading: () => React.ReactElement;
};

export const AuthLoader = ({ children, renderLoading }: AuthLoaderProps) => {
  const { isLoading } = useCurrentUser();

  if (isLoading) {
    return renderLoading();
  }

  return <>{children}</>;
};
