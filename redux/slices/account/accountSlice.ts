import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

import database from '@react-native-firebase/database';

interface account {
  uid?: string;
  displayName?: string;
  email?: string;
  phoneNumber?: string;
  photoURL?: string;
}

interface accountState {
  MyAccount?: account | null;
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

export const updateAccountAPI = createAsyncThunk(
  'account/updateAccountAPI',
  async (data: {uid: string; displayName: string; photoURL: string}) => {
    try {
      const userRef = database().ref(`/users/${data.uid}`);
      await userRef.update({
        displayName: data.displayName,
        photoURL: data.photoURL,
      });
      return {displayName: data.displayName, photoURL: data.photoURL};
    } catch (error) {
      console.log('Error updating account', error);
      throw error;
    }
  },
);

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    // updateProfile: (
    //   state,
    //   action: PayloadAction<{displayName: string; photoURL: string}>,
    // ) => {
    //   state.MyAccount.displayName = action.payload.displayName;
    //   state.MyAccount.photoURL = action.payload.photoURL;
    // },
  },
  extraReducers: builder => {
    // Get Account API
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
    // Update Account API
    builder.addCase(updateAccountAPI.pending, state => {
      state.isloadingAccount = true;
      state.isErrorAccount = false;
    });
    builder.addCase(updateAccountAPI.fulfilled, (state, action) => {
      if (state.MyAccount) {
        state.MyAccount.displayName = action.payload.displayName;
        state.MyAccount.photoURL = action.payload.photoURL;
      } else {
        console.log('Loi~');
      }
      state.isloadingAccount = false;
      state.isErrorAccount = false;
    });
    builder.addCase(updateAccountAPI.rejected, state => {
      state.isloadingAccount = false;
      state.isErrorAccount = true;
    });
  },
});

export const {} = accountSlice.actions;

export default accountSlice.reducer;
