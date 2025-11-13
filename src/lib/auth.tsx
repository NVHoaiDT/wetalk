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

const getUserById = async (userId: number): Promise<{ data: User }> => {
  return api.get(`/users/${userId}`);
};

export const useUser = (userId: number) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById(userId),
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

      /* TODO:Add config onSuccess in consumers and remove this */
      window.location.href = paths.auth.login.getHref();
    },
  });
};

/* ____________________Login with email and password____________________ */
export const loginWithEmailAndPasswordInputSchema = z.object({
  email: z.string().min(5, 'Required').email('Invalid email'),
  password: z.string().min(1, 'Required'),
});
export type LoginWithEmailAndPasswordInput = z.infer<
  typeof loginWithEmailAndPasswordInputSchema
>;

const loginWithEmailAndPassword = (
  data: LoginWithEmailAndPasswordInput,
): Promise<LoginResponse> => {
  return api.post('/auth/login', data);
};

type UseLoginWithEmailAndPasswordOptions = {
  onSuccess?: (data: LoginResponse) => void;
};

export const useLoginWithEmailAndPassword = ({
  onSuccess,
}: UseLoginWithEmailAndPasswordOptions = {}) => {
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

/* ____________________Login with Google____________________ */
export const loginWithGoogleInputSchema = z.object({
  idToken: z.string().min(1, 'Required'),
});

type LoginWithGoogleInput = z.infer<typeof loginWithGoogleInputSchema>;

const loginWithGoogle = (
  data: LoginWithGoogleInput,
): Promise<LoginResponse> => {
  return api.post('/auth/google-login', data);
};

type UseLoginWithGoogleOptions = {
  onSuccess?: (data: LoginResponse) => void;
};

export const useLoginWithGoogle = ({
  onSuccess,
}: UseLoginWithGoogleOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['login-google'],
    mutationFn: loginWithGoogle,

    onSuccess: (response) => {
      if (response.data?.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
      }
      queryClient.setQueryData(['user-login'], response);
      onSuccess?.(response);
    },
    onError: (error: any) => {
      console.error('Google login error:', error);
      console.error('Error response:', error?.response?.data);
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
