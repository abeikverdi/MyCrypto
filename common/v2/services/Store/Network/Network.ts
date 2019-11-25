import { ExtendedNetwork, LSKeys } from 'v2/types';
import { makeExplorer } from 'v2/services/EthService';
import { create, read, update, destroy, readAll } from '../DataManager';

const key = LSKeys.NETWORKS;
export const createNetworks = create(key);
export const readNetworks = read(key);
export const updateNetworks = update(key);
export const deleteNetworks = destroy(key);
export const readAllNetworks = () => {
  const networks = readAll(key)();
  return networks.map(({ blockExplorer, ...rest }: ExtendedNetwork) => ({
    ...rest,
    blockExplorer: blockExplorer ? makeExplorer(blockExplorer) : blockExplorer
  }));
};
