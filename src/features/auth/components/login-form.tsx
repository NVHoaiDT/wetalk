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
          <div className="space-y-4">
            <Input
              type="email"
              label="Email"
              placeholder="name@email.com"
              error={formState.errors['email']}
              registration={register('email')}
            />
            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
              error={formState.errors['password']}
              registration={register('password')}
            />
            <div>
              <Button
                isLoading={login.isPending}
                type="submit"
                className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-2 text-gray-500">OR</span>
        </div>
      </div>

      {/* Login with Google */}
      <LoginGoogleForm onSuccess={onSuccess} />

      {/* Sign up link */}
      <div className="text-center text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <Link
          to={paths.auth.register.getHref(redirectTo)}
          className="font-medium text-gray-900 underline hover:text-gray-700"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
};
