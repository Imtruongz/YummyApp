import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AuthState, User} from './types';
 import {userLoginAPI, userRegisterAPI} from './authThunk';

const initialState: AuthState = {
  user: null,
  isLoadingUser: false,
  isErrorUser: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // setUser: (state, action: PayloadAction<User>) => {
    //   state.user = action.payload;
    // },
    // clearUser: state => {
    //   state.user = null;
    // },
  },
  extraReducers: builder => {
    //Login
    builder.addCase(userLoginAPI.pending, state => {
      state.isLoadingUser = true;
      state.isErrorUser = false;
    });
    builder.addCase(userLoginAPI.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isLoadingUser = false;
      state.isErrorUser = false;
    });
    builder.addCase(userLoginAPI.rejected, state => {
      state.isLoadingUser = false;
      state.isErrorUser = true;
    });
    //Register
    builder.addCase(userRegisterAPI.pending, state => {
      state.isLoadingUser = true;
      state.isErrorUser = false;
    });
    builder.addCase(userRegisterAPI.fulfilled, (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isLoadingUser = false;
      state.isErrorUser = false;
    });
    builder.addCase(userRegisterAPI.rejected, state => {
      state.isLoadingUser = false;
      state.isErrorUser = true;
    });
  },
});

export const {} = authSlice.actions;

export default authSlice.reducer;
