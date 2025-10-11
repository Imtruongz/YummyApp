// i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import { MMKV } from 'react-native-mmkv';

import en from './en.json';
import vn from './vn.json';
import zh from './zh.json';
import bankAccountEn from './bank_account_en.json';
import bankAccountVi from './bank_account_vi.json';
import bankAccountZh from './bank_account_zh.json';

const storage = new MMKV();

const resources = {
  en: { 
    translation: {
      ...en,
      ...bankAccountEn
    }
  },
  vn: { 
    translation: {
      ...vn,
      ...bankAccountVi
    }
  },
  zh: { 
    translation: {
      ...zh,
      ...bankAccountZh
    }
  },
};

// Lấy ngôn ngữ đã lưu hoặc sử dụng ngôn ngữ mặc định của thiết bị
const savedLanguage = storage.getString('language');
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
  storage.set('language', lang);
};

export default i18n;
