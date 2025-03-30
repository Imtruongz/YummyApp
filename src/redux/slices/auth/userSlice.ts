import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {UserState, User} from './types';
import {getAllUsers} from './authThunk';

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
    builder.addCase(getAllUsers.pending, state => {
      state.isLoadingUser = true;
      state.isErrorUser = false;
    });
    builder.addCase(
      getAllUsers.fulfilled,
      (state, action: PayloadAction<User[]>) => {
        state.ListUser = action.payload;
        state.isLoadingUser = false;
        state.isErrorUser = false;
      },
    );
    builder.addCase(getAllUsers.rejected, state => {
      state.isLoadingUser = false;
      state.isErrorUser = true;
    });
  },
});

export const {} = userSlice.actions;

export default userSlice.reducer;
