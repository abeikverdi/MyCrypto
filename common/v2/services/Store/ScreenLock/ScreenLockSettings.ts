import { LSKeys } from 'v2/types';
import { updateAll, readSection } from '../DataManager';

const key = LSKeys.ENCRYPTED;
export const updateScreenLockSettings = updateAll(key);
export const readScreenLockSettings = readSection(key);
