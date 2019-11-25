import { ENCRYPTED_STORAGE_KEY } from './constants';

export const getEncryptedCache = (): string => {
  return localStorage.getItem(ENCRYPTED_STORAGE_KEY) || '';
};

export const setEncryptedCache = (newEncryptedCache: string) => {
  localStorage.setItem(ENCRYPTED_STORAGE_KEY, newEncryptedCache);
};

export const destroyEncryptedCache = () => {
  localStorage.removeItem(ENCRYPTED_STORAGE_KEY);
};
