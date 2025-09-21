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

const followSlice = createSlice({
  name: 'follow',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(isFollowingAPI.fulfilled, (state, action) => {
        const userId = getUserIdFromAction(action);
        if (!userId) return;
        state.byUserId[userId] = state.byUserId[userId] || getDefaultUserFollowInfo();
        state.byUserId[userId].isFollowing = action.payload;
      })
      .addCase(getFollowersAPI.fulfilled, (state, action) => {
        const userId = getUserIdFromAction(action);
        if (!userId) return;
        state.byUserId[userId] = state.byUserId[userId] || getDefaultUserFollowInfo();
        state.byUserId[userId].followers = action.payload;
      })
      .addCase(getFollowingAPI.fulfilled, (state, action) => {
        const userId = getUserIdFromAction(action);
        if (!userId) return;
        state.byUserId[userId] = state.byUserId[userId] || getDefaultUserFollowInfo();
        state.byUserId[userId].following = action.payload;
      })
      .addCase(countFollowersAPI.fulfilled, (state, action) => {
        const userId = getUserIdFromAction(action);
        if (!userId) return;
        state.byUserId[userId] = state.byUserId[userId] || getDefaultUserFollowInfo();
        state.byUserId[userId].followerCount = action.payload;
      })
      .addCase(countFollowingAPI.fulfilled, (state, action) => {
        const userId = getUserIdFromAction(action);
        if (!userId) return;
        state.byUserId[userId] = state.byUserId[userId] || getDefaultUserFollowInfo();
        state.byUserId[userId].followingCount = action.payload;
      })
      .addCase(followUserAPI.fulfilled, (state, action) => {
        const userId = getUserIdFromAction(action);
        if (!userId) return;
        state.byUserId[userId] = state.byUserId[userId] || getDefaultUserFollowInfo();
        state.byUserId[userId].isFollowing = true;
        state.byUserId[userId].followerCount += 1;
      })
      .addCase(unfollowUserAPI.fulfilled, (state, action) => {
        const userId = getUserIdFromAction(action);
        if (!userId) return;
        state.byUserId[userId] = state.byUserId[userId] || getDefaultUserFollowInfo();
        state.byUserId[userId].isFollowing = false;
        state.byUserId[userId].followerCount = Math.max(0, state.byUserId[userId].followerCount - 1);
      })
      .addMatcher(
        (action: AnyAction) => action.type.startsWith('follow/') && action.type.endsWith('/pending'),
        (state, action: AnyAction) => {
          const userId = getUserIdFromAction(action);
          if (!userId) return;
          state.byUserId[userId] = state.byUserId[userId] || getDefaultUserFollowInfo();
          state.byUserId[userId].loading = true;
          state.byUserId[userId].error = null;
        }
      )
      .addMatcher(
        (action: AnyAction) => action.type.startsWith('follow/') && action.type.endsWith('/rejected'),
        (state, action: AnyAction) => {
          const userId = getUserIdFromAction(action);
          if (!userId) return;
          state.byUserId[userId] = state.byUserId[userId] || getDefaultUserFollowInfo();
          state.byUserId[userId].loading = false;
          state.byUserId[userId].error = action.payload || action.error?.message || 'Error';
        }
      )
      .addMatcher(
        (action: AnyAction) => action.type.startsWith('follow/') && action.type.endsWith('/fulfilled'),
        (state, action: AnyAction) => {
          const userId = getUserIdFromAction(action);
          if (!userId) return;
          state.byUserId[userId] = state.byUserId[userId] || getDefaultUserFollowInfo();
          state.byUserId[userId].loading = false;
        }
      );
  },
});

export default followSlice.reducer;
