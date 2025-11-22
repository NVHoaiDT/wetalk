import { useEffect, useRef } from 'react';

import { env } from '@/config/env';
import { fancyLog } from '@/helper/fancy-log';
import { useLoginWithGoogle } from '@/lib/auth';

// Google Sign-In types
interface GoogleCallbackResponse {
  credential: string;
  select_by?: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: GoogleCallbackResponse) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: string;
              size?: string;
              theme?: string;
              text?: string;
              shape?: string;
              logo_alignment?: string;
              width?: number;
              locale?: string;
            },
          ) => void;
        };
      };
    };
    handleGoogleCallback?: (response: GoogleCallbackResponse) => void;
  }
}

type LoginGoogleFormProps = {
  onSuccess: () => void;
};

export const LoginGoogleForm = ({ onSuccess }: LoginGoogleFormProps) => {
  const loginWithGoogle = useLoginWithGoogle({ onSuccess });
  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!env.GOOGLE_CLIENT_ID) return;

    window.handleGoogleCallback = (response: GoogleCallbackResponse) => {
      if (response.credential) {
        loginWithGoogle.mutate({ idToken: response.credential });
      } else {
        console.error('Google login failed: No credential received');
      }
    };

    const initializeGoogleSignIn = () => {
      if (window.google) {
        const google = window.google;

        try {
          google.accounts.id.initialize({
            client_id: env.GOOGLE_CLIENT_ID!,
            callback: window.handleGoogleCallback!,
          });

          const buttonContainer = document.getElementById(
            'google-button-container',
          );
          if (buttonContainer) {
            google.accounts.id.renderButton(buttonContainer, {
              type: 'standard',
              size: 'large',
              theme: 'outline',
              text: 'continue_with',
              shape: 'rectangular',
              logo_alignment: 'center',
              width: 400,
            });
            fancyLog('Google button rendered successfully', '✓');
          }
        } catch (error) {
          console.error('Failed to initialize Google Sign-In:', error);
        }
      } else {
        setTimeout(initializeGoogleSignIn, 100);
      }
    };

    initializeGoogleSignIn();

    return () => {
      delete window.handleGoogleCallback;
    };
  }, [loginWithGoogle]);

  const handleCustomButtonClick = () => {
    // Find and click the actual Google button inside the container
    const googleButton = googleButtonRef.current?.querySelector(
      'div[role="button"]',
    ) as HTMLElement;
    if (googleButton) {
      googleButton.click();
    }
  };

  if (!env.GOOGLE_CLIENT_ID) {
    return null;
  }

  return (
    <div className="flex w-full flex-col items-center">
      <div
        ref={googleButtonRef}
        id="google-button-container"
        className="pointer-events-none absolute opacity-0"
        aria-hidden="true"
      ></div>

      {/* Beautiful custom button */}
      <button
        onClick={handleCustomButtonClick}
        disabled={loginWithGoogle.isPending}
        className="group relative flex w-full max-w-md items-center justify-center gap-3 overflow-hidden rounded-full border border-slate-400 bg-transparent px-6 py-2.5 text-base font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-50 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100"></div>

        {loginWithGoogle.isPending ? (
          <>
            <div className="relative size-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
            <span className="relative">Signing in...</span>
          </>
        ) : (
          <>
            {/* Google logo */}
            <svg className="relative size-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="relative">Continue with Google</span>
          </>
        )}
      </button>

      {loginWithGoogle.isError && (
        <div className="mt-2 text-sm text-red-600">
          Google login failed. Please try again or contact support.
        </div>
      )}
    </div>
  );
};
