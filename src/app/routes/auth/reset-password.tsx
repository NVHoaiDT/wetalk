import { useNavigate } from 'react-router';

import { AuthLayout } from '@/components/layouts/auth-layout';
import { useNotifications } from '@/components/ui/notifications';
import { paths } from '@/config/paths';
import { ResetPasswordForm } from '@/features/auth/components/reset-password-form';

const ResetPasswordRoute = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  return (
    <AuthLayout title="Reset Password">
      <ResetPasswordForm
        onSuccess={() => {
          addNotification({
            type: 'success',
            title: 'Success',
            message:
              'Password has been reset successfully. You can now log in with your new password.',
          });
          navigate(paths.auth.login.getHref(), {
            replace: true,
          });
        }}
      />
    </AuthLayout>
  );
};

export default ResetPasswordRoute;
