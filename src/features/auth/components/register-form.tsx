import * as React from 'react';
import { Link, useSearchParams } from 'react-router';

import { Button } from '@/components/ui/button';
import { Form, Input } from '@/components/ui/form';
import { paths } from '@/config/paths';
import { useRegister, registerInputSchema } from '@/lib/auth';

type RegisterFormProps = {
  onSuccess: () => void;
};

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const registering = useRegister({ onSuccess });
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  return (
    <div className="space-y-6">
      <Form
        onSubmit={(values) => {
          registering.mutate(values);
        }}
        schema={registerInputSchema}
        options={{
          shouldUnregister: true,
        }}
      >
        {({ register, formState }) => (
          <div className="space-y-5">
            <Input
              type="text"
              label="User Name"
              placeholder="johndoe"
              error={formState.errors['username']}
              registration={register('username')}
              className="h-12 rounded-full border-gray-400 px-4 text-base placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20"
            />
            <Input
              type="text"
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
                isLoading={registering.isPending}
                type="submit"
                className="h-12 w-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-base font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Register
              </Button>
            </div>
          </div>
        )}
      </Form>

      {/* Log in link */}
      <div className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link
          to={paths.auth.login.getHref(redirectTo)}
          className="font-semibold text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-700"
        >
          Log in
        </Link>
      </div>
    </div>
  );
};
