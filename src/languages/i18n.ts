// i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import en from './en.json';
import vn from './vn.json';
import zh from './zh.json';
import { getStorageString, setStorageString } from '@/utils';

const resources = {
  en: { 
    translation: {
      ...en,
    }
  },
  vn: { 
    translation: {
      ...vn,
    }
  },
  zh: { 
    translation: {
      ...zh,
    }
  },
};

// Lấy ngôn ngữ đã lưu hoặc sử dụng ngôn ngữ mặc định của thiết bị
const savedLanguage = getStorageString('language');
const deviceLanguage = RNLocalize.getLocales()[0]?.languageTag || 'en';
const languageTag = savedLanguage || deviceLanguage;

// Khởi tạo i18n
if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: languageTag,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });
}

// Hàm thay đổi ngôn ngữ và lưu vào storage
export const changeLanguage = async (lang: string) => {
  await i18n.changeLanguage(lang);
  setStorageString('language', lang);
};

export default i18n;
