import { Link, useSearchParams } from 'react-router';

import { Button } from '@/components/ui/button';
import { Form, Input } from '@/components/ui/form';
import { paths } from '@/config/paths';
import { useForgotPassword, forgotPasswordInputSchema } from '@/lib/auth';

type ForgotPasswordFormProps = {
  onSuccess: () => void;
};

export const ForgotPasswordForm = ({ onSuccess }: ForgotPasswordFormProps) => {
  const forgotPassword = useForgotPassword({
    onSuccess,
  });
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  return (
    <div className="space-y-6">
      <Form
        onSubmit={(values) => {
          forgotPassword.mutate(values);
        }}
        schema={forgotPasswordInputSchema}
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
            <div className="pt-2">
              <Button
                isLoading={forgotPassword.isPending}
                type="submit"
                className="h-12 w-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-base font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Send Reset Link
              </Button>
            </div>
          </div>
        )}
      </Form>

      {/* Back to login link */}
      <div className="text-center text-sm text-gray-600">
        Remember your password?{' '}
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
