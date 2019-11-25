import { LocalCache } from 'v2/types';
import { generateUUID } from 'v2/utils';

import { LOCALSTORAGE_KEY } from './constants';
import { IDataCache, DataEntry } from './types';
import StorageService from './LocalStorage';
import { default as DataCache } from './DataCache';

export const getCache = (): LocalCache => {
  return StorageService.instance.getEntry(LOCALSTORAGE_KEY);
};

export const setCache = (newCache: LocalCache) => {
  StorageService.instance.setEntry(LOCALSTORAGE_KEY, newCache);
  DataCache.instance.initializeCache((newCache as unknown) as IDataCache);
};

export const destroyCache = () => {
  StorageService.instance.clearEntry(LOCALSTORAGE_KEY);
  DataCache.instance.initializeCache({});
};

type CollectionKey =
  | 'addressBook'
  | 'accounts'
  | 'assets'
  | 'contracts'
  | 'networks'
  | 'notifications';

type SettingsKey = 'settings' | 'screenLockSettings';

export const create = <K extends CollectionKey>(key: K) => (value: DataEntry) => {
  const uuid = generateUUID();
  const obj = {};
  // @ts-ignore ie. https://app.clubhouse.io/mycrypto/story/2376/remove-ts-ignore-from-common-v2-services-store-localcache-localcache-ts
  obj[uuid] = value;
  DataCache.instance.setEntry(key, obj);
};

export const createWithID = <K extends CollectionKey>(key: K) => (value: DataEntry, id: string) => {
  const uuid = id;
  if (DataCache.instance.getEntry(key, uuid) === undefined) {
    const obj = {};
    // @ts-ignore ie. https://app.clubhouse.io/mycrypto/story/2376/remove-ts-ignore-from-common-v2-services-store-localcache-localcache-ts
    obj[uuid] = value;
    DataCache.instance.setEntry(key, obj);
  } else {
    console.error(`Error: key ${id} already exists in createWithID`);
  }
};

export const read = <K extends CollectionKey>(key: K) => (uuid: string): LocalCache[K][string] => {
  return DataCache.instance.getEntry(key, uuid);
};

export const update = <K extends CollectionKey>(key: K) => (uuid: string, value: DataEntry) => {
  const obj = {};
  // @ts-ignore ie. https://app.clubhouse.io/mycrypto/story/2376/remove-ts-ignore-from-common-v2-services-store-localcache-localcache-ts
  obj[uuid] = value;
  DataCache.instance.setEntry(key, obj);
};

export const updateAll = <K extends CollectionKey | SettingsKey>(key: K) => (value: DataEntry) => {
  DataCache.instance.setEntry(key, value);
};

export const destroy = <K extends CollectionKey>(key: K) => (uuid: string) => {
  DataCache.instance.clearEntry(key, uuid);
};

export const readAll = <K extends CollectionKey>(key: K) => () => {
  const section: LocalCache[K] = readSection(key)();
  const sectionEntries: [string, LocalCache[K][string]][] = Object.entries(section);
  return sectionEntries.map(([uuid, value]) => ({ ...value, uuid }));
};

export const readSection = <K extends CollectionKey | SettingsKey>(key: K) => () => {
  const section: LocalCache[K] = DataCache.instance.getEntries(key);
  return section;
};
