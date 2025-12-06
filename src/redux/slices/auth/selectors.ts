import { RootState } from '../../store';

/**
 * Selectors for auth slice
 */

export const selectAuthState = (state: RootState) => state.auth;

export const selectUser = (state: RootState) => state.auth.user;

export const selectIsLoadingUser = (state: RootState) => state.auth.isLoadingUser;

export const selectAuthError = (state: RootState) => state.auth.isErrorUser;

export const selectUserId = (state: RootState) => state.auth.user?.userId || null;

export const selectViewedUser = (state: RootState) => state.auth.viewedUser;

export const selectListUser = (state: RootState) => state.user.ListUser;

