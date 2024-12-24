import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface AccountState {
  username: string;
  photoURL: string;
}

const initialState: AccountState = {
  username: '',
  photoURL: '',
};

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    updateProfile: (
      state,
      action: PayloadAction<{username: string; photoURL: string}>,
    ) => {
      state.username = action.payload.username;
      state.photoURL = action.payload.photoURL;
    },
  },
});

export const {updateProfile} = accountSlice.actions;

export default accountSlice.reducer;
