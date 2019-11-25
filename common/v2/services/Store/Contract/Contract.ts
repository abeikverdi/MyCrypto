import { LSKeys } from 'v2/types';
import { create, read, update, destroy, readAll } from '../DataManager';

const key = LSKeys.CONTRACTS;
export const createContract = create(key);
export const readContract = read(key);
export const updateContract = update(key);
export const deleteContract = destroy(key);
export const readAllContracts = readAll(key);
