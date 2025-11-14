import { Link, useSearchParams } from 'react-router';

import { Button } from '@/components/ui/button';
import { Form, Input } from '@/components/ui/form';
import { paths } from '@/config/paths';
import {
  useLoginWithEmailAndPassword,
  loginWithEmailAndPasswordInputSchema,
} from '@/lib/auth';

import { LoginGoogleForm } from './login-google-form';

type LoginFormProps = {
  onSuccess: () => void;
};

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const login = useLoginWithEmailAndPassword({
    onSuccess,
  });
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  return (
    <div className="space-y-6">
      <Form
        onSubmit={(values) => {
          login.mutate(values);
        }}
        schema={loginWithEmailAndPasswordInputSchema}
      >
        {({ register, formState }) => (
          <div className="space-y-5">
            <Input
              type="email"
              label="Email"
              placeholder="name@email.com"
              error={formState.errors['email']}
              registration={register('email')}
              className="h-12 rounded-full border-gray-400 px-4 text-base placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20"
            />
            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
              error={formState.errors['password']}
              registration={register('password')}
              className="h-12 rounded-full border-gray-400 px-4 text-base placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20"
            />
            <div className="pt-2">
              <Button
                isLoading={login.isPending}
                type="submit"
                className="h-12 w-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-base font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Log in
              </Button>
            </div>
          </div>
        )}
      </Form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-xs font-medium">
          <span className="bg-white px-3 text-gray-500">OR</span>
        </div>
      </div>

      {/* Login with Google */}
      <LoginGoogleForm onSuccess={onSuccess} />

      {/* Forgot password link */}
      <div className="text-center text-sm">
        <Link
          to={paths.auth.forgotPassword.getHref()}
          className="font-semibold text-gray-700 underline underline-offset-2 transition-colors hover:text-gray-900"
        >
          Forgot my password
        </Link>
      </div>

      {/* Sign up link */}
      <div className="text-center text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <Link
          to={paths.auth.register.getHref(redirectTo)}
          className="font-semibold text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-700"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
};
