import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import { resources } from '@/shared/i18n/resources';

if (!i18next.isInitialized) {
  void i18next.use(initReactI18next).init({
    compatibilityJSON: 'v4',
    resources,
    lng: 'pt',
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false,
    },
  });
}

export default i18next;
