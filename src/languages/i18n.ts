// i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import en from './en.json';
import vn from './vn.json';

const resources = {
  en: { translation: en },
  vn: { translation: vn },
};

// Sử dụng getLocales() để lấy ngôn ngữ của thiết bị.
const locales = RNLocalize.getLocales();
const languageTag = locales.length > 0 ? locales[0].languageTag : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: languageTag,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
