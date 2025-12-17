import {createAsyncThunk} from '@reduxjs/toolkit';
import api from '@/api/config';
import {LoginPayload, RegisterPayload, UpdatePayload, ChangePasswordPayload, User, FacebookLoginPayload, VerifyEmailPayload} from './types';

export const userLoginAPI = createAsyncThunk(
  'auth/userLoginAPI',
  async (payload: LoginPayload, {rejectWithValue}) => {
    try {
      const response = await api.post('/users/login', payload);
      if (response && response.data) {
        console.log('✅ LOGIN SUCCESS');
        console.log('📱 Access Token:', response.data.accessToken);
        console.log('👤 User ID:', response.data.userId);
        console.log('👤 User Name:', response.data.username);
        console.log('📦 Full Response:', response.data);
        return response.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Login failed';
      return rejectWithValue(errorMessage);
    }
  },
);

export const userRegisterAPI = createAsyncThunk(
  'auth/userRegisterAPI',
  async (payload: RegisterPayload, {rejectWithValue}) => {
    try {
      const response = await api.post('/users/register', payload);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Registration failed';
      return rejectWithValue(errorMessage);
    }
  },
);

export const userUpdateAPI = createAsyncThunk(
  'auth/userUpdateAPI',
  async (payload: UpdatePayload, {rejectWithValue}) => {
    try {
      const response = await api.patch<User>('/users/update', payload);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Update failed';
      return rejectWithValue(errorMessage);
    }
  },
);

export const changePasswordAPI = createAsyncThunk(
  'auth/changePasswordAPI',
  async (payload: ChangePasswordPayload, {rejectWithValue}) => {
    try {
      const response = await api.patch<User>('/users/changePassword', payload);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Password change failed';
      return rejectWithValue(errorMessage);
    }
  },
);

export const userDeleteAPI = createAsyncThunk(
  'auth/userDeleteAPI',
  async (_, {rejectWithValue}) => {
    try {
      const response = await api.delete('/users/delete');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Delete failed';
      return rejectWithValue(errorMessage);
    }
  },
);

export const getUserByIdAPI = createAsyncThunk(
  'auth/getUserByIdAPI',
  async ({userId, isViewMode = false}: {userId: string, isViewMode?: boolean}, {rejectWithValue}) => {
    try {
      const response = await api.get(`/users/getUserById/${userId}`);
      return {
        data: response.data,
        isViewMode
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to fetch user';
      return rejectWithValue(errorMessage);
    }
  },
);

export const getAllUsers = createAsyncThunk(
  'auth/getAllUsers',
  async (_, {rejectWithValue}) => {
    try {
      const response = await api.get('/users/getAll');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to fetch users';
      return rejectWithValue(errorMessage);
    }
  },
);

export const facebookLoginAPI = createAsyncThunk(
  'auth/facebookLoginAPI',
  async (payload: FacebookLoginPayload, {rejectWithValue}) => {
    try {
      const response = await api.post('/users/facebook-login', payload);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Facebook login failed';
      return rejectWithValue(errorMessage);
    }
  },
);

// ← NEW: Verify email with code
export const verifyEmailAPI = createAsyncThunk(
  'auth/verifyEmailAPI',
  async (payload: VerifyEmailPayload, {rejectWithValue}) => {
    try {
      const response = await api.post('/users/verify-email', payload);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Email verification failed';
      return rejectWithValue(errorMessage);
    }
  },
);

// ← NEW: Resend verification email
export const resendVerificationEmailAPI = createAsyncThunk(
  'auth/resendVerificationEmailAPI',
  async (payload: {email: string}, {rejectWithValue}) => {
    try {
      const response = await api.post('/users/resend-verification-email', payload);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to resend verification email';
      return rejectWithValue(errorMessage);
    }
  },
);
