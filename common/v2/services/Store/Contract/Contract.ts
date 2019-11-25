import { create, read, update, destroy, readAll } from '../DataManager';

export const createContract = create('contracts');
export const readContract = read('contracts');
export const updateContract = update('contracts');
export const deleteContract = destroy('contracts');
export const readAllContracts = readAll('contracts');
