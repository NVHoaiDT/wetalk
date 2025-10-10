import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Navigate, useLocation } from 'react-router';
import { z } from 'zod';

import { paths } from '@/config/paths';
import { RegisterResponse, LoginResponse, UserResponse } from '@/types/api';

import { api } from './api-client';

/* User */
const getUser = async (): Promise<UserResponse | null> => {
  return api.get('/users/me');
};

export const useUser = () => {
  const token = localStorage.getItem('access_token');

  return useQuery({
    enabled: !!token,
    queryKey: ['user'],
    queryFn: getUser,
  });
};

/* Logout */
const logout = async (): Promise<void> => {
  localStorage.removeItem('access_token');
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(['user'], null);
      queryClient.removeQueries({ queryKey: ['user'] });
      window.location.href = paths.auth.login.getHref();
    },
  });
};

/* Login */
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
    retry: false,
    onSuccess: (response) => {
      if (response.data?.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
      }
      queryClient.setQueryData(['user-login'], response);
      onSuccess?.(response);
    },
  });
};

/* Register */
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
  const user = useUser();
  const location = useLocation();

  if (!user.data) {
    return (
      <Navigate to={paths.auth.login.getHref(location.pathname)} replace />
    );
  }

  return children;
};

/* Auth Loader */
type AuthLoaderProps = {
  children: React.ReactNode;
  renderLoading: () => React.ReactElement;
};

export const AuthLoader = ({ children, renderLoading }: AuthLoaderProps) => {
  const { isLoading } = useUser();

  if (isLoading) {
    return renderLoading();
  }

  return <>{children}</>;
};
