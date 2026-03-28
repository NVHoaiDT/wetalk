import '@testing-library/jest-dom/vitest';

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import { initializeDb, resetDb } from '@/testing/mocks/db';
import { server } from '@/testing/mocks/server';

vi.mock('zustand');

// Initialize i18next for tests with minimal configuration
i18next
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    ns: ['common'],
    defaultNS: 'common',
    resources: {
      en: {
        common: {
          // Tests will use empty strings for missing keys, which is safe
          // Phase 2 will populate actual English strings
        },
      },
    },
    interpolation: {
      escapeValue: false, // React handles XSS protection
    },
    // Suppress warnings about missing keys in test environment
    missingInterpolationHandler: () => '',
  });

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());
beforeEach(() => {
  const ResizeObserverMock = vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  vi.stubGlobal('ResizeObserver', ResizeObserverMock);

  window.btoa = (str: string) => Buffer.from(str, 'binary').toString('base64');
  window.atob = (str: string) => Buffer.from(str, 'base64').toString('binary');

  initializeDb();
});
afterEach(() => {
  server.resetHandlers();
  resetDb();
});
