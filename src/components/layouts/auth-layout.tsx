import * as React from 'react';
import { useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router';

import logo from '@/assets/logo.svg';
import { Head } from '@/components/seo';
import { Link } from '@/components/ui/link';
import { paths } from '@/config/paths';
import { useCurrentUser } from '@/lib/auth';

type LayoutProps = {
  children: React.ReactNode;
  title: string;
};

export const AuthLayout = ({ children, title }: LayoutProps) => {
  const user = useCurrentUser();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');
  const location = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    if (user.data) {
      navigate(redirectTo ? redirectTo : paths.app.dashboard.getHref(), {
        replace: true,
      });
    }
  }, [user.data, navigate, redirectTo]);

  // Determine if we're on the register page
  const isRegisterPage = location.pathname.includes('register');

  return (
    <>
      <Head title={title} />
      <div className="flex min-h-screen bg-white">
        {/* Left side - Form or Image (swap based on page) */}
        <div
          className={`flex w-full items-center justify-center transition-all duration-500 lg:w-1/2 ${
            isRegisterPage ? 'order-2' : 'order-1'
          }`}
        >
          <div className="w-full max-w-md px-8 py-12">
            <div className="mb-8">
              {/* <Link className="mb-6 inline-block" to={paths.home.getHref()}>
                <img className="h-8 w-auto" src={logo} alt="Maze" />
              </Link> */}
              <h2 className="mt-6 text-3xl font-bold text-gray-900">{title}</h2>
              <p className="mt-2 text-sm text-gray-600">
                {isRegisterPage ? 'Create your account' : 'Have we met before?'}
              </p>
            </div>
            {children}
          </div>
        </div>

        {/* Right side - Image or Form (swap based on page) */}
        <div
          className={`hidden w-1/2 items-center justify-center bg-gray-50 transition-all duration-500 lg:flex ${
            isRegisterPage ? 'order-1' : 'order-2'
          }`}
        >
          <div className="w-full p-8">
            <img
              src="/login-decor-image.png"
              alt="Decorative illustration"
              className="rounded-3xl object-cover"
            />
          </div>
        </div>
      </div>
    </>
  );
};
