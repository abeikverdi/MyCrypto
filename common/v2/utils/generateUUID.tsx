import * as crypto from 'crypto';
import { TUuid } from 'v2/types';

// TODO: If used for anything other than generating public ids, look up a more-secure way to do this.
export const generateUUID = (): TUuid => {
  const hexstring = crypto.randomBytes(16).toString('hex');
  const uuid =
    hexstring.substring(0, 8) +
    '-' +
    hexstring.substring(8, 12) +
    '-' +
    hexstring.substring(12, 16) +
    '-' +
    hexstring.substring(16, 20) +
    '-' +
    hexstring.substring(20);
  return uuid as TUuid;
};
