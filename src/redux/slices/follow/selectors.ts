import { RootState } from '../../store';

/**
 * Selectors for follow slice
 */

export const selectFollowState = (state: RootState) => state.follow;

export const selectUserFollowInfo = (userId: string) => (state: RootState) =>
  state.follow.byUserId[userId];

export const selectIsFollowing = (userId: string) => (state: RootState) =>
  state.follow.byUserId[userId]?.isFollowing ?? false;

export const selectFollowers = (userId: string) => (state: RootState) =>
  state.follow.byUserId[userId]?.followers ?? [];

export const selectFollowing = (userId: string) => (state: RootState) =>
  state.follow.byUserId[userId]?.following ?? [];

export const selectFollowerCount = (userId: string) => (state: RootState) =>
  state.follow.byUserId[userId]?.followerCount ?? 0;

export const selectFollowingCount = (userId: string) => (state: RootState) =>
  state.follow.byUserId[userId]?.followingCount ?? 0;

export const selectFollowLoading = (userId: string) => (state: RootState) =>
  state.follow.byUserId[userId]?.loading ?? false;

export const selectFollowError = (userId: string) => (state: RootState) =>
  state.follow.byUserId[userId]?.error ?? null;
