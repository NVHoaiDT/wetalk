import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import i18next from '@/i18n/config';

type LanguageStoreState = {
  language: 'en' | 'vi';
  setLanguage: (lang: 'en' | 'vi') => void;
};

export const useLanguageStore = create<LanguageStoreState>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (lang: 'en' | 'vi') => {
        i18next.changeLanguage(lang);
        set({ language: lang });
      },
    }),
    {
      name: 'language-store', // localStorage key
      version: 1,
    },
  ),
);
