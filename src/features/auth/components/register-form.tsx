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
          <div className="space-y-4">
            <Input
              type="text"
              label="User Name"
              placeholder="johndoe"
              error={formState.errors['username']}
              registration={register('username')}
            />
            <Input
              type="text"
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
                isLoading={registering.isPending}
                type="submit"
                className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
          className="font-medium text-gray-900 underline hover:text-gray-700"
        >
          Log in
        </Link>
      </div>
    </div>
  );
};
