import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AuthState, User} from './types';
import {
  userLoginAPI,
  userRegisterAPI,
  getUserByIdAPI,
  userUpdateAPI,
  userDeleteAPI,
  changePasswordAPI,
} from './authThunk';

const initialState: AuthState = {
  user: null,
  isLoadingUser: false,
  isErrorUser: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: builder => {
    //Login
    builder.addCase(userLoginAPI.pending, state => {
      state.isLoadingUser = true;
      state.isErrorUser = false;
    });
    builder.addCase(
      userLoginAPI.fulfilled,
      (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.isLoadingUser = false;
        state.isErrorUser = false;
      },
    );
    builder.addCase(userLoginAPI.rejected, state => {
      state.isLoadingUser = false;
      state.isErrorUser = true;
    });
    //Register
    builder.addCase(userRegisterAPI.pending, state => {
      state.isLoadingUser = true;
      state.isErrorUser = false;
    });
    builder.addCase(
      userRegisterAPI.fulfilled,
      (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.isLoadingUser = false;
        state.isErrorUser = false;
      },
    );
    builder.addCase(userRegisterAPI.rejected, state => {
      state.isLoadingUser = false;
      state.isErrorUser = true;
    });
    //Get User By Id
    builder.addCase(getUserByIdAPI.pending, state => {
      state.isLoadingUser = true;
      state.isErrorUser = false;
    });
    builder.addCase(
      getUserByIdAPI.fulfilled,
      (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.isLoadingUser = false;
        state.isErrorUser = false;
      },
    );
    builder.addCase(getUserByIdAPI.rejected, state => {
      state.isLoadingUser = false;
      state.isErrorUser = true;
    });
    //Update User
    builder.addCase(userUpdateAPI.pending, state => {
      state.isLoadingUser = true;
      state.isErrorUser = false;
    });
    builder.addCase(userUpdateAPI.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isLoadingUser = false;
      state.isErrorUser = false;
    });
    builder.addCase(userUpdateAPI.rejected, state => {
      state.isLoadingUser = false;
      state.isErrorUser = true;
    });
    //Change Password
    builder.addCase(changePasswordAPI.pending, state => {
      state.isLoadingUser = true;
      state.isErrorUser = false;
    });
    builder.addCase(changePasswordAPI.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isLoadingUser = false;
      state.isErrorUser = false;
    });
    builder.addCase(changePasswordAPI.rejected, state => {
      state.isLoadingUser = false;
      state.isErrorUser = true;
    });

    //Delete User
    builder.addCase(userDeleteAPI.pending, state => {
      state.isLoadingUser = true;
      state.isErrorUser = false;
    });
    builder.addCase(userDeleteAPI.fulfilled, state => {
      state.user = null;
      state.isLoadingUser = false;
      state.isErrorUser = false;
    });
    builder.addCase(userDeleteAPI.rejected, state => {
      state.isLoadingUser = false;
      state.isErrorUser = true;
    });
  },
});

export const {} = authSlice.actions;

export default authSlice.reducer;
