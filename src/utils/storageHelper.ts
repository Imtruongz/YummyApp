import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

export const storageHelper = {
  // Access Token
  getAccessToken: (): string | null => {
    return storage.getString('accessToken') || null;
  },

  setAccessToken: (token: string): void => {
    storage.set('accessToken', token);
  },

  deleteAccessToken: (): void => {
    storage.delete('accessToken');
  },

  // User ID
  getUserId: (): string | null => {
    return storage.getString('userId') || null;
  },

  setUserId: (id: string): void => {
    storage.set('userId', id);
  },

  deleteUserId: (): void => {
    storage.delete('userId');
  },

  // Generic methods for future use
  getString: (key: string): string | null => {
    return storage.getString(key) || null;
  },

  setString: (key: string, value: string): void => {
    storage.set(key, value);
  },

  delete: (key: string): void => {
    storage.delete(key);
  },

  clearAll: (): void => {
    storage.clearAll();
  },
};