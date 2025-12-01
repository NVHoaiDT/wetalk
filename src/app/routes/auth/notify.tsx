import { Mail, CheckCircle, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router';

import { AuthLayout } from '@/components/layouts/auth-layout';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/components/ui/notifications';
import { paths } from '@/config/paths';
import { useResendRegisterVerificationEmail } from '@/lib/auth';

const NotifyRoute = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { addNotification } = useNotifications();

  const resendMutation = useResendRegisterVerificationEmail({
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: 'Email Sent',
        message: 'Verification email has been resent successfully',
      });
      // Disable resend button for 60 seconds
      setResendDisabled(true);
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
  });

  const handleResendEmail = () => {
    if (!email) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Email address is missing',
      });
      return;
    }
    resendMutation.mutate({ email });
  };

  return (
    <AuthLayout title="Check Your Email">
      <div className="space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-blue-500 opacity-20 blur-xl"></div>
            <div className="relative rounded-full bg-gradient-to-br from-blue-500 to-blue-600 p-5 shadow-lg">
              <Mail className="size-10 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 rounded-full bg-green-500 p-1.5 shadow-md">
              <CheckCircle className="size-4 text-white" />
            </div>
          </div>
        </div>

        <div className="space-y-3 text-center">
          <p className="text-sm text-gray-600">
            We&apos;ve sent a verification link to
          </p>

          {/* Email display */}
          <div className="rounded-lg border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-3">
            <p className="break-all font-semibold text-blue-700">{email}</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-3 rounded-lg bg-gray-50 p-4">
          <div className="flex items-start space-x-3">
            <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-100">
              <span className="text-sm font-semibold text-blue-600">1</span>
            </div>
            <p className="text-sm text-gray-700">
              Open your email inbox and look for our message
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-100">
              <span className="text-sm font-semibold text-blue-600">2</span>
            </div>
            <p className="text-sm text-gray-700">
              Click the verification link to activate your account
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-100">
              <span className="text-sm font-semibold text-blue-600">3</span>
            </div>
            <p className="text-sm text-gray-700">
              You&apos;ll be redirected to login once verified
            </p>
          </div>
        </div>

        {/* Resend button */}
        <Button
          onClick={handleResendEmail}
          disabled={resendDisabled || resendMutation.isPending}
          isLoading={resendMutation.isPending}
          className="h-12 w-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-base font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {resendDisabled && countdown > 0 ? (
            <span>Resend in {countdown}s</span>
          ) : (
            <>
              <RefreshCw className="mr-2 size-4" />
              <span>Resend Verification Email</span>
            </>
          )}
        </Button>

        {/* Back to login */}
        <div className="text-center text-sm text-gray-600">
          <Link
            to={paths.auth.login.getHref()}
            className="font-semibold text-gray-700 underline underline-offset-2 transition-colors hover:text-gray-900"
          >
            Back to Login
          </Link>
        </div>

        {/* Help text */}
        <div className="border-t border-gray-200 pt-4">
          <p className="text-center text-xs text-gray-500">
            Didn&apos;t receive the email? Check your spam folder or contact
            support.
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default NotifyRoute;
