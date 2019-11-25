import { LSKeys } from 'v2/types';
import { create, read, update, destroy, readAll } from 'v2/services/Store';

const key = LSKeys.NOTIFICATIONS;
export const createNotification = create(key);
export const readNotification = read(key);
export const updateNotification = update(key);
export const deleteNotification = destroy(key);
export const readAllNotifications = readAll(key);
