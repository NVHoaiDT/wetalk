import { Link, useSearchParams } from 'react-router';

import { Button } from '@/components/ui/button';
import { Form, Input } from '@/components/ui/form';
import { paths } from '@/config/paths';
import { useResetPassword, resetPasswordInputSchema } from '@/lib/auth';

type ResetPasswordFormProps = {
  onSuccess: () => void;
};

export const ResetPasswordForm = ({ onSuccess }: ResetPasswordFormProps) => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const redirectTo = searchParams.get('redirectTo');

  const resetPassword = useResetPassword({
    onSuccess,
  });

  return (
    <div className="space-y-6">
      <Form
        onSubmit={(values) => {
          resetPassword.mutate({
            token,
            newPassword: values.newPassword,
          });
        }}
        schema={resetPasswordInputSchema}
      >
        {({ register, formState }) => (
          <div className="space-y-5">
            <Input
              type="password"
              label="New Password"
              placeholder="••••••••"
              error={formState.errors['newPassword']}
              registration={register('newPassword')}
              className="h-12 rounded-full border-gray-400 px-4 text-base placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20"
            />
            <div className="pt-2">
              {/* Submit button */}
              <Button
                isLoading={resetPassword.isPending}
                type="submit"
                className="h-12 w-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-base font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Reset Password
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
