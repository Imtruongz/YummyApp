import { createSlice, PayloadAction, AnyAction } from '@reduxjs/toolkit';
import {
  followUserAPI,
  unfollowUserAPI,
  isFollowingAPI,
  getFollowersAPI,
  getFollowingAPI,
  countFollowersAPI,
  countFollowingAPI,
} from './followThunk';


interface UserFollowInfo {
  isFollowing: boolean;
  followers: any[];
  following: any[];
  followerCount: number;
  followingCount: number;
  loading: boolean;
  error: string | null;
}

interface FollowState {
  byUserId: {
    [userId: string]: UserFollowInfo;
  };
}

const initialState: FollowState = {
  byUserId: {},
};


const getUserIdFromAction = (action: AnyAction): string | undefined => {
  // Thunks truyền userId trực tiếp hoặc trong meta.arg
  if (action.meta && action.meta.arg) {
    if (typeof action.meta.arg === 'string') return action.meta.arg;
    if (typeof action.meta.arg === 'object') {
      return action.meta.arg.userId || action.meta.arg.followingId;
    }
  }
  return undefined;
};

const getDefaultUserFollowInfo = (): UserFollowInfo => ({
  isFollowing: false,
  followers: [],
  following: [],
  followerCount: 0,
  followingCount: 0,
  loading: false,
  error: null,
});

/**
 * Helper to handle pending state for all follow actions
 */
const handleFollowPending = (state: FollowState, action: AnyAction) => {
  const userId = getUserIdFromAction(action);
  if (!userId) return;
  state.byUserId[userId] = state.byUserId[userId] || getDefaultUserFollowInfo();
  state.byUserId[userId].loading = true;
  state.byUserId[userId].error = null;
};

/**
 * Helper to handle rejected state for all follow actions
 */
const handleFollowRejected = (state: FollowState, action: AnyAction) => {
  const userId = getUserIdFromAction(action);
  if (!userId) return;
  state.byUserId[userId] = state.byUserId[userId] || getDefaultUserFollowInfo();
  state.byUserId[userId].loading = false;
  state.byUserId[userId].error = action.payload || action.error?.message || 'Error';
};

/**
 * Helper to handle fulfilled state for all follow actions
 */
const handleFollowFulfilled = (state: FollowState, action: AnyAction) => {
  const userId = getUserIdFromAction(action);
  if (!userId) return;
  state.byUserId[userId] = state.byUserId[userId] || getDefaultUserFollowInfo();
  state.byUserId[userId].loading = false;
};

const followSlice = createSlice({
  name: 'follow',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle specific API responses
    builder
      .addCase(isFollowingAPI.fulfilled, (state, action) => {
        const userId = getUserIdFromAction(action);
        if (!userId) return;
        state.byUserId[userId] = state.byUserId[userId] || getDefaultUserFollowInfo();
        state.byUserId[userId].isFollowing = action.payload;
        state.byUserId[userId].loading = false;
      })
      .addCase(getFollowersAPI.fulfilled, (state, action) => {
        const userId = getUserIdFromAction(action);
        if (!userId) return;
        state.byUserId[userId] = state.byUserId[userId] || getDefaultUserFollowInfo();
        state.byUserId[userId].followers = action.payload;
        state.byUserId[userId].loading = false;
      })
      .addCase(getFollowingAPI.fulfilled, (state, action) => {
        const userId = getUserIdFromAction(action);
        if (!userId) return;
        state.byUserId[userId] = state.byUserId[userId] || getDefaultUserFollowInfo();
        state.byUserId[userId].following = action.payload;
        state.byUserId[userId].loading = false;
      })
      .addCase(countFollowersAPI.fulfilled, (state, action) => {
        const userId = getUserIdFromAction(action);
        if (!userId) return;
        state.byUserId[userId] = state.byUserId[userId] || getDefaultUserFollowInfo();
        state.byUserId[userId].followerCount = action.payload;
        state.byUserId[userId].loading = false;
      })
      .addCase(countFollowingAPI.fulfilled, (state, action) => {
        const userId = getUserIdFromAction(action);
        if (!userId) return;
        state.byUserId[userId] = state.byUserId[userId] || getDefaultUserFollowInfo();
        state.byUserId[userId].followingCount = action.payload;
        state.byUserId[userId].loading = false;
      })
      .addCase(followUserAPI.fulfilled, (state, action) => {
        // Don't manually update counters here - let the refresh handle it
        // This prevents incorrect state updates
        const userId = getUserIdFromAction(action);
        if (!userId) return;
        state.byUserId[userId] = state.byUserId[userId] || getDefaultUserFollowInfo();
        state.byUserId[userId].loading = false;
      })
      .addCase(unfollowUserAPI.fulfilled, (state, action) => {
        // Don't manually update counters here - let the refresh handle it
        // This prevents incorrect state updates
        const userId = getUserIdFromAction(action);
        if (!userId) return;
        state.byUserId[userId] = state.byUserId[userId] || getDefaultUserFollowInfo();
        state.byUserId[userId].loading = false;
      })
      // Handle pending for all follow actions
      .addMatcher(
        (action: AnyAction) => action.type.startsWith('follow/') && action.type.endsWith('/pending'),
        handleFollowPending
      )
      // Handle rejected for all follow actions
      .addMatcher(
        (action: AnyAction) => action.type.startsWith('follow/') && action.type.endsWith('/rejected'),
        handleFollowRejected
      )
      // Handle fulfilled (generic) for all follow actions
      .addMatcher(
        (action: AnyAction) => action.type.startsWith('follow/') && action.type.endsWith('/fulfilled'),
        handleFollowFulfilled
      );
  },
});

export default followSlice.reducer;
