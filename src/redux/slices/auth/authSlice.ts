import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AuthState, User} from './types';
import {
  userLoginAPI,
  userRegisterAPI,
  getUserByIdAPI,
  userUpdateAPI,
  userDeleteAPI,
  changePasswordAPI,
  facebookLoginAPI,
} from './authThunk';
import { createAsyncThunkHandler } from '../../utils/asyncThunkHandler';

const initialState: AuthState = {
  user: null,
  isLoadingUser: false,
  isErrorUser: false,
  viewedUser: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetViewedUser: (state) => {
      state.viewedUser = null;
    },
    setViewedUser: (state, action: PayloadAction<User>) => {
      state.viewedUser = action.payload;
    }
  },
  extraReducers: builder => {
    // Login
    createAsyncThunkHandler(builder, userLoginAPI, {
      onFulfilled: (state, action: PayloadAction<User>) => {
        state.user = action.payload;
      },
    });

    // Register
    createAsyncThunkHandler(builder, userRegisterAPI, {
      onFulfilled: (state, action: PayloadAction<User>) => {
        state.user = action.payload;
      },
    });

    // Get User By Id
    createAsyncThunkHandler(builder, getUserByIdAPI, {
      onFulfilled: (state, action: PayloadAction<{ data: User, isViewMode?: boolean }>) => {
        if (action.payload.isViewMode) {
          state.viewedUser = action.payload.data;
        } else {
          state.user = action.payload.data;
        }
      },
    });

    // Update User
    createAsyncThunkHandler(builder, userUpdateAPI, {
      onFulfilled: (state, action: PayloadAction<User>) => {
        state.user = action.payload;
      },
    });

    // Change Password
    createAsyncThunkHandler(builder, changePasswordAPI, {
      onFulfilled: (state, action: PayloadAction<User>) => {
        state.user = action.payload;
      },
    });

    // Delete User
    createAsyncThunkHandler(builder, userDeleteAPI, {
      onFulfilled: (state) => {
        state.user = null;
      },
    });

    // Facebook Login
    createAsyncThunkHandler(builder, facebookLoginAPI, {
      onFulfilled: (state, action: PayloadAction<User>) => {
        state.user = action.payload;
      },
    });
  },
});

export const { resetViewedUser, setViewedUser } = authSlice.actions;

export default authSlice.reducer;
