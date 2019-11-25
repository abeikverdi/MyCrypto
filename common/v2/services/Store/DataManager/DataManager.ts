import { LocalCache } from 'v2/types';
import { generateUUID } from 'v2/utils';

import { IDataCache, DataEntry } from './types';
import { default as DataCache } from './DataCache';
import { LSKeys } from './constants';

const service = new DataCache();

export const getCache = (): LocalCache => {
  return service.storage.getEntry();
};

export const setCache = (newCache: LocalCache) => {
  service.storage.setEntry(newCache);
  service.initializeCache((newCache as unknown) as IDataCache);
};

export const destroyCache = () => {
  service.storage.clearEntry();
  service.initializeCache({});
};

export const create = <K extends LSKeys>(key: K) => (value: DataEntry) => {
  const uuid = generateUUID();
  const obj = {};
  // @ts-ignore ie. https://app.clubhouse.io/mycrypto/story/2376/remove-ts-ignore-from-common-v2-services-store-localcache-localcache-ts
  obj[uuid] = value;
  service.setEntry(key, obj);
};

export const createWithID = <K extends LSKeys>(key: K) => (value: DataEntry, id: string) => {
  const uuid = id;
  if (service.getEntry(key, uuid) === undefined) {
    const obj = {};
    // @ts-ignore ie. https://app.clubhouse.io/mycrypto/story/2376/remove-ts-ignore-from-common-v2-services-store-localcache-localcache-ts
    obj[uuid] = value;
    service.setEntry(key, obj);
  } else {
    console.error(`Error: key ${id} already exists in createWithID`);
  }
};

export const read = <K extends LSKeys>(key: K) => (uuid: string): LocalCache[K][string] => {
  return service.getEntry(key, uuid);
};

export const update = <K extends LSKeys>(key: K) => (uuid: string, value: DataEntry) => {
  const obj = {};
  // @ts-ignore ie. https://app.clubhouse.io/mycrypto/story/2376/remove-ts-ignore-from-common-v2-services-store-localcache-localcache-ts
  obj[uuid] = value;
  service.setEntry(key, obj);
};

export const updateAll = <K extends LSKeys>(key: K) => (value: DataEntry) => {
  service.setEntry(key, value);
};

export const destroy = <K extends LSKeys>(key: K) => (uuid: string) => {
  service.clearEntry(key, uuid);
};

export const readAll = <K extends LSKeys>(key: K) => () => {
  const section: LocalCache[K] = readSection(key)();
  const sectionEntries: [string, LocalCache[K][string]][] = Object.entries(section);
  return sectionEntries.map(([uuid, value]) => ({ ...value, uuid }));
};

export const readSection = <K extends LSKeys>(key: K) => () => {
  const section: LocalCache[K] = service.getEntries(key);
  return section;
};
