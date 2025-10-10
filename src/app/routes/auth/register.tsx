import { useNavigate, useSearchParams } from 'react-router';

import { AuthLayout } from '@/components/layouts/auth-layout';
import { paths } from '@/config/paths';
import { RegisterForm } from '@/features/auth/components/register-form';

const RegisterRoute = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  return (
    <AuthLayout title="Register your account">
      <RegisterForm
        onSuccess={() => {
          navigate(
            `${redirectTo ? `${redirectTo}` : paths.auth.notify.getHref()}`,
            {
              replace: true,
            },
          );
          console.log('navigating to ', paths.auth.verify.getHref());
        }}
      />
    </AuthLayout>
  );
};

export default RegisterRoute;
