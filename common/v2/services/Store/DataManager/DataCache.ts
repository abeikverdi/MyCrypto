import get from 'lodash/get';

import { IS_DEV } from 'v2/utils';
import StorageService from './LocalStorage';
import { LOCALSTORAGE_KEY } from './constants';
import { IDataCache, DataEntry } from './types';

// Keep an in Memory copy of LocalStorage.
// If usefull we can restore ttl checks for stale cache by checking
// https://github.com/MyCryptoHQ/MyCrypto/commit/d10b804e35bb44ce72b8d7d0363b0bbd0ebf7a73
export class CacheServiceBase {
  private cache: IDataCache = {};

  public constructor() {
    const persistedCache = StorageService.instance.getEntry(LOCALSTORAGE_KEY);

    if (persistedCache) {
      this.initializeCache(persistedCache);
    }
  }

  public initializeCache(cache: IDataCache) {
    this.cache = cache;
  }

  public getEntry(identifier: string, entryKey: string): any {
    this.ensureSubcache(identifier);

    // First, try retrieving the value from the in-memory cache.
    let entry = get(this.cache, `${identifier}.${entryKey}`);

    // If that fails, try retrieving it from LocalStorage.
    if (!entry) {
      const storage = StorageService.instance.getEntry(LOCALSTORAGE_KEY);

      if (storage && storage[identifier]) {
        entry = storage[identifier][entryKey];

        // If it existed in LocalStorage but not in memory, add it to memory.
        (this.cache as any)[identifier][entryKey] = entry;
      }
    }

    return entry;
  }

  public setEntry(identifier: string, entries: DataEntry) {
    this.ensureSubcache(identifier);

    Object.entries(entries).forEach(([key, value]) => (this.cache[identifier][key] = value));

    this.updatePersistedCache();
  }

  public getEntries(identifier: string): any {
    this.ensureSubcache(identifier);

    // First, try retrieving the value from the in-memory cache.
    let entry = get(this.cache, `${identifier}`);

    // If that fails, try retrieving it from LocalStorage.
    if (!entry) {
      const storage = StorageService.instance.getEntry(LOCALSTORAGE_KEY);

      if (storage && storage[identifier]) {
        entry = storage[identifier];

        // If it existed in LocalStorage but not in memory, add it to memory.
        (this.cache as any)[identifier] = entry;
      }
    }

    // Extracts the actual cached values for every entry
    return Object.keys(entry).reduce((result: DataEntry, key) => {
      result[key] = entry[key];
      return result;
    }, {});
  }

  public clearEntry(identifier: string, key: string) {
    this.ensureSubcache(identifier);

    const {
      [identifier]: { [key]: _, ...cache }
    } = this.cache;

    this.cache[identifier] = cache;
    this.updatePersistedCache();
  }

  private ensureSubcache(identifier: string) {
    const subcache = this.cache[identifier];

    if (!subcache) {
      this.cache[identifier] = {};
    }
  }

  private updatePersistedCache() {
    StorageService.instance.setEntry(LOCALSTORAGE_KEY, this.cache);
  }
}

let instantiated = false;

// tslint:disable-next-line
export default class CacheService extends CacheServiceBase {
  public static instance = new CacheService();

  constructor() {
    super();

    if (instantiated) {
      throw new Error(`CacheService has already been instantiated.`);
    } else {
      instantiated = true;
    }

    if (IS_DEV) {
      (window as any).CacheService = this;
    }
  }
}
