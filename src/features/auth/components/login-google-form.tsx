import { useEffect } from 'react';

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

  useEffect(() => {
    if (!env.GOOGLE_CLIENT_ID) return;

    const currentOrigin = window.location.origin;
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const port = window.location.port;

    console.log('=== Google OAuth Debug ===');
    fancyLog('Full origin:', currentOrigin);
    fancyLog('Protocol:', protocol);
    fancyLog('Hostname:', hostname);
    fancyLog('Port:', port);
    fancyLog('GOOGLE_CLIENT_ID:', env.GOOGLE_CLIENT_ID);
    console.log('========================');

    // Define the global callback handler for Google Sign-In
    window.handleGoogleCallback = (response: GoogleCallbackResponse) => {
      if (response.credential) {
        fancyLog(
          'Google credential received, length:',
          response.credential.length,
        );
        loginWithGoogle.mutate({ idToken: response.credential });
      } else {
        console.error('Google login failed: No credential received');
      }
    };

    // Wait for Google library to load
    const initializeGoogleSignIn = () => {
      if (window.google) {
        const google = window.google;

        try {
          // Initialize Google Sign-In
          google.accounts.id.initialize({
            client_id: env.GOOGLE_CLIENT_ID!,
            callback: window.handleGoogleCallback!,
          });

          // Render the button
          const buttonContainer = document.getElementById(
            'google-button-container',
          );
          if (buttonContainer) {
            google.accounts.id.renderButton(buttonContainer, {
              type: 'standard',
              size: 'large',
              theme: 'outline',
              text: 'signin_with',
              shape: 'rectangular',
              logo_alignment: 'left',
              width: buttonContainer.offsetWidth || 300,
              locale: 'en',
            });
            fancyLog('Google button rendered successfully', '✓');
          }
        } catch (error) {
          console.error('Failed to initialize Google Sign-In:', error);
        }
      } else {
        // Retry if Google library not loaded yet
        setTimeout(initializeGoogleSignIn, 100);
      }
    };

    initializeGoogleSignIn();

    // Cleanup
    return () => {
      delete window.handleGoogleCallback;
    };
  }, [loginWithGoogle]);

  if (!env.GOOGLE_CLIENT_ID) {
    return null;
  }

  return (
    <div className="w-full">
      <div id="google-button-container" className="w-full"></div>
      {loginWithGoogle.isError && (
        <div className="mt-2 text-sm text-red-600">
          Google login failed. Please try again or contact support.
        </div>
      )}
    </div>
  );
};
