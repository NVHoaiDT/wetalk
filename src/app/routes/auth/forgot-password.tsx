import { useNavigate } from 'react-router';

import { AuthLayout } from '@/components/layouts/auth-layout';
import { useNotifications } from '@/components/ui/notifications';
import { paths } from '@/config/paths';
import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form';

const ForgotPasswordRoute = () => {
  const navigate = useNavigate();

  const { addNotification } = useNotifications();

  return (
    <AuthLayout title="Forgot Password">
      <ForgotPasswordForm
        onSuccess={(email) => {
          addNotification({
            type: 'success',
            title: 'Success',
            message:
              'Password reset link has been sent to your email. Please check your inbox.',
          });

          navigate(paths.auth.notifyResetPassword.getHref(email), {
            replace: true,
          });
        }}
      />
    </AuthLayout>
  );
};

export default ForgotPasswordRoute;
