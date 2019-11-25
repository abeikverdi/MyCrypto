import { getCache, setCache, updateAll, readSection } from '../DataManager';

export const updateSetting = updateAll('settings');
export const readAllSettings = readSection('settings');

export const readStorage = () => getCache() || '[]';

export const importStorage = (importedCache: string) => {
  setCache(JSON.parse(importedCache));
};
