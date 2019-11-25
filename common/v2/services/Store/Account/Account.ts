import { LSKeys } from 'v2/types';
import { create, read, update, destroy, readAll, createWithID } from '../DataManager';

const key = LSKeys.ACCOUNTS;
export const createAccount = create(key);
export const createAccountWithID = createWithID(key);
export const readAccount = read(key);
export const updateAccount = update(key);
export const deleteAccount = destroy(key);
export const readAccounts = readAll(key);
