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

/* ____________________Forgot password____________________ */
export const forgotPasswordInputSchema = z.object({
  email: z.string().min(1, 'Required').email('Invalid email'),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordInputSchema>;

const forgotPassword = (
  data: ForgotPasswordInput,
): Promise<{ message: string }> => {
  return api.post('/auth/forgot-password', data);
};

type UseForgotPasswordOptions = {
  onSuccess?: (data: { message: string }) => void;
};

export const useForgotPassword = ({
  onSuccess,
}: UseForgotPasswordOptions = {}) => {
  return useMutation({
    mutationKey: ['forgot-password'],
    mutationFn: forgotPassword,
    onSuccess: (response) => {
      onSuccess?.(response);
    },
  });
};

/* ____________________Reset password____________________ */
export const resetPasswordInputSchema = z.object({
  token: z.string().min(1, 'Required'),
  newPassword: z.string().min(5, 'Required'),
});
export type ResetPasswordInput = z.infer<typeof resetPasswordInputSchema>;

const resetPassword = (
  data: ResetPasswordInput,
): Promise<{ message: string }> => {
  return api.post('/auth/reset-password', data);
};

type UseResetPasswordOptions = {
  onSuccess?: (data: { message: string }) => void;
};

export const useResetPassword = ({
  onSuccess,
}: UseResetPasswordOptions = {}) => {
  return useMutation({
    mutationKey: ['reset-password'],
    mutationFn: resetPassword,
    onSuccess: (response) => {
      onSuccess?.(response);
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

/* ____________________Resend register verification email____________________ */
export const resendRegisterVerificationEmailInput = z.object({
  email: z.string().min(1, 'Required').email('Invalid email'),
});
export type ResendRegisterVerificationEmailInput = z.infer<
  typeof resendRegisterVerificationEmailInput
>;

const resendRegisterVerificationEmail = (
  data: ResendRegisterVerificationEmailInput,
): Promise<{ message: string }> => {
  return api.post('/auth/resend-verification', data);
};

type UseResendRegisterVerificationEmailOptions = {
  onSuccess?: (data: { message: string }) => void;
};

export const useResendRegisterVerificationEmail = ({
  onSuccess,
}: UseResendRegisterVerificationEmailOptions = {}) => {
  return useMutation({
    mutationKey: ['resend-verification-email'],
    mutationFn: resendRegisterVerificationEmail,
    onSuccess: (response) => {
      onSuccess?.(response);
    },
  });
};

/* ____________________Change password____________________ */
export const changePasswordInput = z.object({
  oldPassword: z.string().min(1, 'Required'),
  newPassword: z.string().min(1, 'Required'),
});
export type ChangePasswordInput = z.infer<typeof changePasswordInput>;

const changePassword = (data: ChangePasswordInput) => {
  return api.put('/users/change-password', data);
};
type UseChangePasswordOptions = {
  onSuccess?: () => void;
};

export const useChangePassword = ({
  onSuccess,
}: UseChangePasswordOptions = {}) => {
  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      onSuccess?.();
    },
  });
};

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useCurrentUser();
  const location = useLocation();

  if (!user.data?.data) {
    return (
      <Navigate to={paths.auth.login.getHref(location.pathname)} replace />
    );
  }

  return children;
};

export const ProtectedAction = ({
  authenticatedFallback,
  unauthenticatedFallback,
}: {
  authenticatedFallback: React.ReactNode;
  unauthenticatedFallback: React.ReactNode;
}) => {
  const user = useCurrentUser();

  if (!user.data) {
    return unauthenticatedFallback;
  }

  return authenticatedFallback;
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
