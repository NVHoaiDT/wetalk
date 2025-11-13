import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router';

import logo from '@/assets/logo.svg';
import { Head } from '@/components/seo';
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

  // Animation state - start with true to prevent flicker
  const [isAnimating, setIsAnimating] = useState(true);
  const [prevPathname, setPrevPathname] = useState(location.pathname);

  useEffect(() => {
    // Only trigger animation if the pathname actually changed
    if (location.pathname !== prevPathname) {
      setIsAnimating(true);
      setPrevPathname(location.pathname);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    } else {
      // First render - quickly settle
      const timer = setTimeout(() => setIsAnimating(false), 50);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, prevPathname]);

  return (
    <>
      <Head title={title} />
      <div className="flex min-h-screen overflow-hidden bg-gradient-to-br from-indigo-200 via-white to-purple-200">
        {/* Left side - Form or Image (swap based on page) */}
        <div
          className={`flex w-full items-center justify-center transition-all duration-700 ease-in-out lg:w-1/2 ${
            isRegisterPage ? 'order-2' : 'order-1'
          }`}
          style={{
            transform: isAnimating
              ? isRegisterPage
                ? 'translateX(-2%)'
                : 'translateX(2%)'
              : 'translateX(0)',
            opacity: isAnimating ? 0.7 : 1,
          }}
        >
          <div className="w-full max-w-md px-8 py-12">
            <div
              className="mb-8 transition-all duration-500"
              style={{
                opacity: isAnimating ? 0 : 1,
                transform: isAnimating ? 'translateY(-10px)' : 'translateY(0)',
              }}
            >
              {/* <Link className="mb-6 inline-block" to={paths.home.getHref()}>
                <img className="h-8 w-auto" src={logo} alt="Wetalk" />
              </Link> */}
              <h2 className="mt-6 text-3xl font-bold text-gray-900">{title}</h2>
              <p className="mt-2 text-sm text-gray-600">
                {isRegisterPage ? 'Create your account' : 'Have we met before?'}
              </p>
            </div>
            <div
              className="transition-all delay-100 duration-500"
              style={{
                opacity: isAnimating ? 0.7 : 1,
              }}
            >
              {children}
            </div>
          </div>
        </div>

        {/* Right side - Image or Form (swap based on page) */}
        <div
          className={`hidden w-3/5 items-center justify-center transition-all duration-700 ease-in-out lg:flex ${
            isRegisterPage ? 'order-1' : 'order-2'
          }`}
          style={{
            transform: isAnimating
              ? isRegisterPage
                ? 'translateX(2%)'
                : 'translateX(-2%)'
              : 'translateX(0)',
            opacity: isAnimating ? 0.7 : 1,
          }}
        >
          <div
            className="w-full p-8 transition-all duration-700"
            style={{
              transform: isAnimating ? 'scale(0.95)' : 'scale(1)',
              opacity: isAnimating ? 0.8 : 1,
            }}
          >
            <img
              src="/login-decor-image-1.webp"
              alt="Decorative illustration"
              className="rounded-3xl object-cover"
            />
          </div>
        </div>
      </div>
    </>
  );
};
