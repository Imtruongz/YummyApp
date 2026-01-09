import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserState, User } from './types';
import { getAllUsers, getPopularCreators } from './authThunk';
import { createAsyncThunkHandler } from '../../utils/asyncThunkHandler';

const initialState: UserState = {
  ListUser: [],
  isLoadingUser: false,
  isErrorUser: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // Get All Users
    createAsyncThunkHandler(builder, getAllUsers, {
      loadingKey: 'isLoadingUser',
      errorKey: 'isErrorUser',
      onFulfilled: (state, action: PayloadAction<User[]>) => {
        state.ListUser = action.payload;
      },
    });

    // Get Popular Creators
    createAsyncThunkHandler(builder, getPopularCreators, {
      loadingKey: 'isLoadingUser',
      errorKey: 'isErrorUser',
      onFulfilled: (state, action: PayloadAction<User[]>) => {
        state.ListUser = action.payload;
      },
    });
  },
});

export const { } = userSlice.actions;

export default userSlice.reducer;

