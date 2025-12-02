import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { Link, useSearchParams } from 'react-router';

import { Head } from '@/components/seo';
import { Button } from '@/components/ui/button';
import { paths } from '@/config/paths';

const VerifyRoute = () => {
  const [searchParams] = useSearchParams();

  const isSuccess = searchParams.get('success') === 'true';
  const message = searchParams.get('message') || 'Processing verification...';

  return (
    <>
      <Head title="Email Verification" />
      <div className="flex min-h-screen overflow-hidden bg-gradient-to-br from-indigo-200 via-white to-purple-200">
        {/* Left side - Verification Status */}
        <div className="flex w-full items-center justify-center lg:w-1/2">
          <div className="w-full max-w-lg px-8">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Email Verification
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {isSuccess
                  ? 'Your email has been confirmed'
                  : 'Something went wrong'}
              </p>
            </div>

            {/* Content Card */}
            <div className="space-y-6">
              {/* Icon */}
              <div className="flex justify-center">
                {isSuccess ? (
                  <div className="flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-teal-100 to-cyan-100 shadow-lg">
                    <CheckCircle2
                      className="size-14 text-teal-500"
                      strokeWidth={2.5}
                    />
                  </div>
                ) : (
                  <div className="flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-red-100 to-rose-100 shadow-lg">
                    <XCircle
                      className="size-14 text-red-600"
                      strokeWidth={2.5}
                    />
                  </div>
                )}
              </div>

              {/* Message */}
              <div className={`rounded-2xl p-6 backdrop-blur-sm `}>
                <p
                  className={`text-center text-lg font-semibold ${
                    isSuccess ? 'text-green-800' : 'text-yellow-800'
                  }`}
                >
                  {message}
                </p>
              </div>

              {/* Additional Info */}
              {isSuccess && (
                <div className="rounded-xl bg-white/80 p-5 backdrop-blur-sm">
                  <p className="text-center text-sm leading-relaxed text-gray-600">
                    Your account has been successfully verified. You can now
                    sign in to access all features and start connecting with the
                    community.
                  </p>
                </div>
              )}

              {!isSuccess && (
                <div className="rounded-xl bg-white/80 p-5 backdrop-blur-sm">
                  <p className="text-center text-sm leading-relaxed text-gray-600">
                    The verification link may have expired or is invalid. Please
                    try registering again or contact support if the problem
                    persists.
                  </p>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-2">
                <Link to={paths.auth.login.getHref()} className="block">
                  <Button
                    className={`h-12 w-full rounded-full text-base font-semibold text-white shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      isSuccess
                        ? 'bg-gradient-to-r from-teal-500 to-cyan-500 shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 focus:ring-teal-500'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 focus:ring-blue-500'
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      {isSuccess ? 'Continue to Login' : 'Go to Login'}
                      <ArrowRight className="ml-2 size-5" />
                    </div>
                  </Button>
                </Link>
              </div>

              {/* Sign up link for failed verification */}
              {!isSuccess && (
                <div className="text-center text-sm text-gray-600">
                  Need a new account?{' '}
                  <Link
                    to={paths.auth.register.getHref()}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text font-semibold text-transparent underline decoration-blue-500 decoration-wavy decoration-1 underline-offset-2 transition-colors hover:from-blue-600 hover:to-blue-700"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right side - Decorative Image */}
        <div className="hidden w-3/5 items-center justify-center lg:flex">
          <div className="w-full p-8">
            <img
              src="/login-decor-image-1.webp"
              alt="Welcome illustration"
              className="rounded-3xl object-cover"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyRoute;
