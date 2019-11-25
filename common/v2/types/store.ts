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

export interface LocalCache {
  settings: ISettings;
  accounts: Record<string, Account>;
  assets: Record<string, Asset>;
  networks: Record<string, Network>;
  contracts: Record<string, ExtendedContract>;
  addressBook: Record<string, AddressBook>;
  notifications: Record<string, Notification>;
  screenLockSettings?: Partial<ScreenLockSettings>;
}
