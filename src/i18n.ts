// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import tr from './i18n/tr.json';
import en from './i18n/en.json';

i18n
  .use(LanguageDetector) // Tarayıcı dilini algıla
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      tr: { translation: tr }
    },
    fallbackLng: 'tr', // Eğer dil bulunamazsa Türkçe açılsın
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;