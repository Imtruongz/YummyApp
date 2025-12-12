import { createMMKV, MMKV } from 'react-native-mmkv';

let storageInstance: MMKV | null = null;

/**
 * Initialize and get MMKV storage instance
 * Handles initialization safely without throwing errors
 */
export const getStorage = (): MMKV | null => {
  if (storageInstance !== null) {
    return storageInstance;
  }

  try {
    storageInstance = createMMKV();
    return storageInstance;
  } catch (error) {
    console.error('Failed to initialize MMKV storage:', error);
    return null;
  }
};

/**
 * Safe getter for string values from storage
 */
export const getStorageString = (key: string, defaultValue: string = ''): string => {
  const storage = getStorage();
  if (!storage) return defaultValue;
  try {
    return storage.getString(key) || defaultValue;
  } catch (error) {
    console.error(`Failed to get string from storage for key ${key}:`, error);
    return defaultValue;
  }
};

/**
 * Safe setter for string values to storage
 */
export const setStorageString = (key: string, value: string): boolean => {
  const storage = getStorage();
  if (!storage) return false;
  try {
    storage.set(key, value);
    return true;
  } catch (error) {
    console.error(`Failed to set string in storage for key ${key}:`, error);
    return false;
  }
};

/**
 * Safe getter for number values from storage
 */
export const getStorageNumber = (key: string, defaultValue: number = 0): number => {
  const storage = getStorage();
  if (!storage) return defaultValue;
  try {
    return storage.getNumber(key) ?? defaultValue;
  } catch (error) {
    console.error(`Failed to get number from storage for key ${key}:`, error);
    return defaultValue;
  }
};

/**
 * Safe setter for number values to storage
 */
export const setStorageNumber = (key: string, value: number): boolean => {
  const storage = getStorage();
  if (!storage) return false;
  try {
    storage.set(key, value);
    return true;
  } catch (error) {
    console.error(`Failed to set number in storage for key ${key}:`, error);
    return false;
  }
};

/**
 * Safe getter for boolean values from storage
 */
export const getStorageBoolean = (key: string, defaultValue: boolean = false): boolean => {
  const storage = getStorage();
  if (!storage) return defaultValue;
  try {
    return storage.getBoolean(key) ?? defaultValue;
  } catch (error) {
    console.error(`Failed to get boolean from storage for key ${key}:`, error);
    return defaultValue;
  }
};

/**
 * Safe setter for boolean values to storage
 */
export const setStorageBoolean = (key: string, value: boolean): boolean => {
  const storage = getStorage();
  if (!storage) return false;
  try {
    storage.set(key, value);
    return true;
  } catch (error) {
    console.error(`Failed to set boolean in storage for key ${key}:`, error);
    return false;
  }
};

/**
 * Delete a key from storage
 */
export const deleteStorageKey = (key: string): boolean => {
  const storage = getStorage();
  if (!storage) return false;
  try {
    storage.remove(key);
    return true;
  } catch (error) {
    console.error(`Failed to delete key from storage: ${key}:`, error);
    return false;
  }
};

export default getStorage();
