import {createAsyncThunk} from '@reduxjs/toolkit';

import api from '../../../api/api';

export const getAllFoodAPI = createAsyncThunk(
  'food/getAllFoodAPI',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/foods/getAll');
      return response.data;
    } catch (error: any) {
      console.log('Errorrrr fooood:', error.message, `DataFoood:`, error.response?.data);
      return rejectWithValue(error.response?.data);
    }
  },
);
