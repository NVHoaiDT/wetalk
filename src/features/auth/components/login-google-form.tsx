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
  const initAttempts = useRef(0);
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
    };
  }, [loginWithGoogle]);

  if (!env.GOOGLE_CLIENT_ID) {
    return null;
  }

  return (
    <div className="flex w-full flex-col items-center">
      <div id="google-button-container" className="w-full max-w-md"></div>

      {loginWithGoogle.isError && (
        <div className="mt-2 text-sm text-red-600">
          {loginWithGoogle.error?.message ||
            'Google login failed. Please try again or contact support.'}
        </div>
      )}
    </div>
  );
};
