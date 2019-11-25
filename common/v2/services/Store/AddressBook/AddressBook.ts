import { LSKeys } from 'v2/types';
import { create, destroy, read, readAll, update } from '../DataManager';

const key = LSKeys.ADDRESS_BOOK;
export const createAddressBook = create(key);
export const readAddressBook = read(key);
export const updateAddressBook = update(key);
export const deleteAddressBook = destroy(key);
export const readAddressBooks = readAll(key);
