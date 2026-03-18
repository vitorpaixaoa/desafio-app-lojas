import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import i18next from '@/shared/i18n';
import { AppLanguage } from '@/shared/i18n/resources';

type LanguageState = {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'pt',
      setLanguage: (language) => {
        set({ language });
        void i18next.changeLanguage(language);
      },
    }),
    {
      name: 'desafio-app-lojas-language',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
