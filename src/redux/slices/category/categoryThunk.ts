import {createAsyncThunk} from '@reduxjs/toolkit';
import {category} from './types';
import api from '../../../api/config';

export const getAllCategoriesAPI = createAsyncThunk(
  'categories/getAllCategoriesAPI',
  async (_, thunkAPI) => {
    try {
      const response = await api.get<category[]>('/categories/getAll', {
        signal: thunkAPI.signal,
      });

      if (!response.data || response.data.length === 0) {
        console.error('No data returned from the server for getAllFoodAPI');
        return thunkAPI.rejectWithValue('No data returned from the server');
      }
      return response.data;
    } catch (error: any) {
      console.log(
        'Error from getAllCategoriesAPI:',
        error.message,
        'Data',
        error.response?.data,
      );
      return thunkAPI.rejectWithValue(
        'An error occurred while fetching categories',
      );
    }
  },
);
