import { Mail, CheckCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router';

import { paths } from '@/config/paths';

const NotifyRoute = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || 'your email';

  const handleResendEmail = () => {};

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="email-blob absolute left-10 top-20 size-72 rounded-full bg-blue-200 opacity-30 mix-blend-multiply blur-xl"></div>
        <div className="absolute right-10 top-40 size-72 rounded-full bg-purple-200 opacity-30 mix-blend-multiply blur-xl"></div>
        <div className="absolute bottom-20 left-1/2 size-72 rounded-full bg-indigo-200 opacity-30 mix-blend-multiply blur-xl"></div>
      </div>

      {/* Main card */}
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-blue-500 opacity-30 blur-xl"></div>
            <div className="relative rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-6 shadow-lg">
              <Mail className="size-12 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 rounded-full bg-green-500 p-1.5 shadow-lg">
              <CheckCircle className="size-5 text-white" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="mb-3 text-center text-3xl font-bold text-gray-900">
          Check Your Email
        </h1>

        <p className="mb-6 text-center text-gray-600">
          We&apos;ve sent a verification link to
        </p>

        {/* Email display */}
        <div className="mb-6 rounded-lg border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
          <p className="break-all text-center font-semibold text-blue-700">
            {email}
          </p>
        </div>

        {/* Instructions */}
        <div className="mb-8 space-y-3">
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
        <button
          onClick={handleResendEmail}
          className="mb-4 flex w-full items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl active:scale-95"
        >
          <RefreshCw className="size-5" />
          <span>Resend Verification Email</span>
        </button>

        {/* Back to login */}
        <button
          onClick={() => navigate(paths.auth.login.getHref())}
          className="flex w-full items-center justify-center space-x-2 rounded-lg px-4 py-2 font-medium text-gray-600 transition-colors duration-200 hover:text-gray-900"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Login</span>
        </button>

        {/* Help text */}
        <div className="mt-6 border-t border-gray-200 pt-6">
          <p className="text-center text-sm text-gray-500">
            Didn&apos;t receive the email? Check spam or contact support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotifyRoute;
