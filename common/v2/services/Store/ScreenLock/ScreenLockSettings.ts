import { updateAll, readSection } from '../DataManager';

export const updateScreenLockSettings = updateAll('screenLockSettings');
export const readScreenLockSettings = readSection('screenLockSettings');
