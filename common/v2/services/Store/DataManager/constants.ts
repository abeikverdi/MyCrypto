import { LocalCache } from 'v2/types';
import { defaultSettings } from 'v2/config';
// The name of the key in LocalStorage used for persistence.
export const LOCALSTORAGE_KEY = 'MyCryptoStorage';

export const ENCRYPTED_STORAGE_KEY = 'MyCryptoEncrypted';

export const CACHE_INIT: LocalCache = {
  settings: defaultSettings,
  accounts: {},
  assets: {},
  networks: {},
  contracts: {},
  addressBook: {},
  notifications: {}
};

export enum LSKeys {
  ADDRESS_BOOK = 'addressBook',
  ACCOUNTS = 'accounts',
  ASSETS = 'assets',
  CONTRACTS = 'contracts',
  NETWORKS = 'networks',
  NOTIFICATIONS = 'notifications',
  SETTINGS = 'settings'
}
