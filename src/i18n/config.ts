import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

// English namespace (will be extended with VI translations in Phase 5)
const enCommon = {
  // Namespace structure placeholder for now (will be populated in Phase 2)
};

const resources = {
  en: {
    common: enCommon,
  },
  vi: {
    // Vietnamese namespace (will be added in Phase 5)
    common: {},
  },
};

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false, // React already escapes XSS
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18next;

// TypeScript type safety for translation keys
declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: (typeof resources)['en']['common'];
    };
  }
}

declare global {
  interface Window {
    i18next: typeof i18next;
  }
}
