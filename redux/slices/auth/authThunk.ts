import {createAsyncThunk} from '@reduxjs/toolkit';

import api from '../../../api/api';

import {LoginPayload, RegisterPayload} from './types';

export const userLoginAPI = createAsyncThunk(
  'auth/userLoginAPI',
  async (payload: LoginPayload, {rejectWithValue}) => {
    console.log('Payload:', payload);
    try {
      const response = await api.post('/users/login', payload);
      console.log('Full API Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.log('Errorrrr:', error.message, `Data:`, error.response?.data);
      return rejectWithValue(error.response?.data);
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
      return rejectWithValue(error.response.data);
    }
  },
);
