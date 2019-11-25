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

export interface LocalStorage {
  settings: ISettings;
  accounts: Record<string, Account>;
  assets: Record<string, Asset>;
  networks: Record<string, Network>;
  contracts: Record<string, ExtendedContract>;
  addressBook: Record<string, AddressBook>;
  notifications: Record<string, Notification>;
  screenLockSettings?: Partial<ScreenLockSettings>;
}

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
