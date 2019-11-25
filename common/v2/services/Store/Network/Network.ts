import { ExtendedNetwork, LSKeys } from 'v2/types';
import { makeExplorer } from 'v2/services/EthService';
import { create, read, update, destroy, readAll } from '../DataManager';

const key = LSKeys.NETWORKS;
export const createNetwork = create(key);
export const readNetwork = read(key);
export const updateNetwork = update(key);
export const deleteNetwork = destroy(key);
export const readNetworks = () => {
  const networks = readAll(key)();
  return networks.map(({ blockExplorer, ...rest }: ExtendedNetwork) => ({
    ...rest,
    blockExplorer: blockExplorer ? makeExplorer(blockExplorer) : blockExplorer
  }));
};
