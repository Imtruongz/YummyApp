import { RootState } from '../../store';

/**
 * Selectors for notification slice
 */

export const selectNotificationState = (state: RootState) => state.notification;

export const selectNotificationList = (state: RootState) => state.notification.list;

export const selectIsLoadingNotification = (state: RootState) => state.notification.isLoading;

export const selectNotificationError = (state: RootState) => state.notification.isError;

export const selectUnreadNotificationCount = (state: RootState) =>
  state.notification.list.filter(n => !n.isRead).length;

export const selectHasUnreadNotifications = (state: RootState) =>
  state.notification.list.some(n => !n.isRead);
