import { LSKeys } from 'v2/types';
import { getCache, setCache, updateAll, readSection } from '../DataManager';

const key = LSKeys.SETTINGS;
export const updateSetting = updateAll(key);
export const readAllSettings = readSection(key);
export const readStorage = () => JSON.stringify(getCache());
export const importStorage = (importedCache: string) => {
  setCache(JSON.parse(importedCache));
};
