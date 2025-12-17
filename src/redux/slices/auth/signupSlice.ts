import { createSlice } from '@reduxjs/toolkit';

interface SignUpFormData {
  username: string;
  email: string;
  password: string;
}

interface SignUpState {
  formData: SignUpFormData | null;
}

const initialState: SignUpState = {
  formData: null,
};

const signUpSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    saveSignUpForm: (state, action) => {
      state.formData = action.payload;
    },
    clearSignUpForm: (state) => {
      state.formData = null;
    },
  },
});

export const { saveSignUpForm, clearSignUpForm } = signUpSlice.actions;
export default signUpSlice.reducer;
