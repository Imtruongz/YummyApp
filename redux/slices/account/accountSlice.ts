import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface AccountState {
  displayName: string;
  photoURL: string;
}

const initialState: AccountState = {
  displayName: '',
  photoURL: '',
};

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    updateProfile: (
      state,
      action: PayloadAction<{displayName: string; photoURL: string}>,
    ) => {
      state.displayName = action.payload.displayName;
      state.photoURL = action.payload.photoURL;
    },
  },
});

export const {updateProfile} = accountSlice.actions;

export default accountSlice.reducer;
