import { LSKeys } from 'v2/types';
import { create, read, update, destroy, readAll, createWithID } from '../DataManager';

const key = LSKeys.ASSETS;
export const createAsset = create(key);
export const createAssetWithID = createWithID(key);
export const readAsset = read(key);
export const updateAsset = update(key);
export const deleteAsset = destroy(key);
export const readAssets = readAll(key);
