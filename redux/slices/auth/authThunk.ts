import {createAsyncThunk} from '@reduxjs/toolkit';
import api from '../../../api/api';
import {LoginPayload, RegisterPayload, UpdatePayload} from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const userLoginAPI = createAsyncThunk(
  'auth/userLoginAPI',
  async (payload: LoginPayload, {rejectWithValue}) => {
    try {
      const response = await api.post('/users/login', payload);
      if (response && response.data) {
        AsyncStorage.setItem('accessToken', response.data.accessToken);
        AsyncStorage.setItem('refreshToken', response.data.refreshToken);
        AsyncStorage.setItem('userId', response.data.user.userId);
        return response.data;
      }
    } catch (error: any) {
      console.log('Errorrrr:', error.message, 'Data', error.response?.data);
      return rejectWithValue(error.response?.data);
    }
  },
);

export const userRegisterAPI = createAsyncThunk(
  'auth/userRegisterAPI',
  async (payload: RegisterPayload, {rejectWithValue}) => {
    console.log('Payload:', payload);

    try {
      const response = await api.post('/users/register', payload);
      return response.data;
    } catch (error: any) {
      console.log('Errorrrr:', error.message, 'Data', error.response?.data);
      return rejectWithValue(error.response.data);
    }
  },
);

export const userUpdateAPI = createAsyncThunk(
  'auth/userUpdateAPI',
  async (payload: UpdatePayload, {rejectWithValue}) => {
    try {
      const response = await api.patch('/users/update', payload);
      return response.data;
    } catch (error: any) {
      console.log('Errorrrr:', error.message, 'Data', error.response?.data);
      return rejectWithValue(error.response.data);
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
      console.log('Errorrrr:', error.message, 'Data', error.response?.data);
      return rejectWithValue(error.response.data);
    }
  },
);

export const getUserByIdAPI = createAsyncThunk(
  'auth/getUserByIdAPI',
  async (userId: string, {rejectWithValue}) => {
    try {
      const response = await api.get(`/users/getUserById/${userId}`);
      return response.data;
    } catch (error: any) {
      console.log(
        'Error in getUserByIdAPI:',
        error.message,
        'Data',
        error.response?.data,
      );
      return rejectWithValue(error.response.data);
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
      console.log(
        'Error in getAllUsers:',
        error.message,
        'Data',
        error.response?.data,
      );
      return rejectWithValue(error.response.data);
    }
  },
);
