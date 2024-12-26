import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';

import database from '@react-native-firebase/database';

interface account {
  uid?: string;
  displayName?: string;
  email?: string;
  phoneNumber?: string;
  photoURL?: string;
}

interface accountState {
  MyAccount: account | null;
  isloadingAccount?: boolean;
  isErrorAccount?: boolean;
}

const initialState: accountState = {
  MyAccount: null,
  isloadingAccount: false,
  isErrorAccount: false,
};

export const accountAPI = createAsyncThunk(
  'account/accountAPI',
  async (uid: string) => {
    try {
      const response = await database().ref(`/users/${uid}`).once('value');
      const rawData = response.val();
      if (rawData) {
        return rawData as account;
      }
      return null;
    } catch (error) {
      console.log('Error getting account', error);
      throw error;
    }
  },
);

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    // updateAccount: (
    //   state,
    //   action: PayloadAction<{displayName: string; photoURL: string}>,
    // ) => {
    //   state.MyAccount?.displayName = action.payload.displayName;
    //   state.MyAccount?.photoURL = action.payload.photoURL;
    // },
  },
  extraReducers: builder => {
    builder.addCase(accountAPI.pending, state => {
      state.isloadingAccount = true;
      state.isErrorAccount = false;
    });
    builder.addCase(accountAPI.fulfilled, (state, action) => {
      state.MyAccount = action.payload;
      state.isloadingAccount = false;
      state.isErrorAccount = false;
    });
    builder.addCase(accountAPI.rejected, state => {
      state.isloadingAccount = false;
      state.isErrorAccount = true;
    });
  },
});

export const {} = accountSlice.actions;

export default accountSlice.reducer;
