import {createAsyncThunk} from '@reduxjs/toolkit';

import api from '../../../api/api';

export const getAllCategoriesAPI = createAsyncThunk(
  'categories/getAllCategoriesAPI',
  async (_, {rejectWithValue}) => {
    try {
      const response = await api.get('/categories/getAll');
      return response.data;
    } catch (error: any) {
      console.log('Errorrrr:', error.message, `Data:`, error.response?.data);
      return rejectWithValue(error.response?.data);
    }
  },
);
