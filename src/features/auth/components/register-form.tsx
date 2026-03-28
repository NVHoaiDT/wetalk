import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router';

import { Button } from '@/components/ui/button';
import { Form, Input } from '@/components/ui/form';
import { paths } from '@/config/paths';
import { useRegister, registerInputSchema } from '@/lib/auth';

type RegisterFormProps = {
  onSuccess: (email: string) => void;
};

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const { t } = useTranslation('auth');
  const [submittedEmail, setSubmittedEmail] = React.useState('');

  const registering = useRegister({
    onSuccess: () => {
      // Pass the stored email to the onSuccess callback
      onSuccess(submittedEmail);
    },
  });
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  return (
    <div className="space-y-6">
      <Form
        onSubmit={(values) => {
          setSubmittedEmail(values.email);
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
              label={t('label.username')}
              placeholder={t('placeholder.usernameInput')}
              error={formState.errors['username']}
              registration={register('username')}
              className="h-12 rounded-full border-gray-400 px-4 text-base placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20"
            />
            <Input
              type="text"
              label={t('label.email')}
              placeholder={t('placeholder.enterEmail')}
              error={formState.errors['email']}
              registration={register('email')}
              className="h-12 rounded-full border-gray-400 px-4 text-base placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20"
            />
            <Input
              type="password"
              label={t('label.password')}
              placeholder={t('placeholder.passwordInput')}
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
                {t('action.register')}
              </Button>
            </div>
          </div>
        )}
      </Form>

      {/* Log in link */}
      <div className="text-center text-sm text-gray-600">
        {t('label.haveAccount')}{' '}
        <Link
          to={paths.auth.login.getHref(redirectTo)}
          className="font-semibold text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-700"
        >
          {t('action.login')}
        </Link>
      </div>
    </div>
  );
};
