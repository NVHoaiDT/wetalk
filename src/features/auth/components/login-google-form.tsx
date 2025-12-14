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
  const initAttempts = useRef(0);
  const isGoogleReadyRef = useRef(false);
  const maxAttempts = 50; // 5 seconds max

  useEffect(() => {
    if (!env.GOOGLE_CLIENT_ID) {
      console.error('GOOGLE_CLIENT_ID is not configured');
      return;
    }

    console.log(
      'Initializing Google Sign-In with client ID:',
      env.GOOGLE_CLIENT_ID,
    );

    window.handleGoogleCallback = (response: GoogleCallbackResponse) => {
      console.log('Google callback triggered', {
        hasCredential: !!response.credential,
      });
      if (response.credential) {
        loginWithGoogle.mutate({ idToken: response.credential });
      } else {
        console.error('Google login failed: No credential received');
      }
    };

    const initializeGoogleSignIn = () => {
      initAttempts.current += 1;

      if (window.google?.accounts?.id) {
        const google = window.google;

        try {
          console.log('Google API loaded, initializing...');
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

            // Wait a bit for the button to be fully rendered in the DOM
            setTimeout(() => {
              const renderedButton =
                buttonContainer.querySelector('div[role="button"]');
              if (renderedButton) {
                console.log('Google button found in DOM');
                isGoogleReadyRef.current = true;
              } else {
                console.warn('Google button not found after render');
              }
            }, 200);

            console.log('Google button rendered successfully');
            fancyLog('Google button rendered successfully', '✓');
          } else {
            console.error('Button container not found');
          }
        } catch (error) {
          console.error('Failed to initialize Google Sign-In:', error);
        }
      } else if (initAttempts.current < maxAttempts) {
        console.log(
          `Waiting for Google API... (attempt ${initAttempts.current}/${maxAttempts})`,
        );
        setTimeout(initializeGoogleSignIn, 100);
      } else {
        console.error('Google API failed to load after 5 seconds');
      }
    };

    initializeGoogleSignIn();

    return () => {
      delete window.handleGoogleCallback;
      initAttempts.current = 0;
      isGoogleReadyRef.current = false;
    };
  }, [loginWithGoogle]);

  const handleCustomButtonClick = () => {
    console.log('Custom button clicked');

    const buttonContainer = document.getElementById('google-button-container');
    if (!buttonContainer) {
      console.error('Button container not found');
      return;
    }

    // Google renders the button as an iframe
    const iframe = buttonContainer.querySelector('iframe') as HTMLIFrameElement;

    if (iframe) {
      console.log('Google iframe found, triggering click');
      // Click the iframe to trigger the Google sign-in
      iframe.click();
    } else {
      console.error('Google iframe not found in container');
      console.log('Container HTML:', buttonContainer.innerHTML);

      // Fallback: Try to trigger Google One Tap
      if (window.google?.accounts?.id) {
        console.log('Attempting fallback: Google One Tap prompt');
        try {
          console.log('Google One Tap prompt triggered');
        } catch (error) {
          console.error('One Tap prompt failed:', error);
        }
      }
    }
  };

  if (!env.GOOGLE_CLIENT_ID) {
    console.warn('Google Client ID not configured');
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
          {loginWithGoogle.error?.message ||
            'Google login failed. Please try again or contact support.'}
        </div>
      )}
    </div>
  );
};
