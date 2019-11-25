import {
  Account,
  Asset,
  AddressBook,
  ExtendedContract,
  ISettings,
  Network,
  ScreenLockSettings,
  Notification
} from 'v2/types';

export enum LSKeys {
  ADDRESS_BOOK = 'addressBook',
  ACCOUNTS = 'accounts',
  ASSETS = 'assets',
  CONTRACTS = 'contracts',
  NETWORKS = 'networks',
  NOTIFICATIONS = 'notifications',
  SETTINGS = 'settings',
  ENCRYPTED = 'screenLockSettings'
}

export interface LocalStorage {
  [LSKeys.SETTINGS]: ISettings;
  [LSKeys.ACCOUNTS]: Record<string, Account>;
  [LSKeys.ASSETS]: Record<string, Asset>;
  [LSKeys.NETWORKS]: Record<string, Network>;
  [LSKeys.CONTRACTS]: Record<string, ExtendedContract>;
  [LSKeys.ADDRESS_BOOK]: Record<string, AddressBook>;
  [LSKeys.NOTIFICATIONS]: Record<string, Notification>;
  [LSKeys.ENCRYPTED]?: Partial<ScreenLockSettings>;
}
