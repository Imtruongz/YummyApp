import {createAsyncThunk} from '@reduxjs/toolkit';

import api from '../../../api/api';

export const getAllFoodAPI = createAsyncThunk(
  'food/getAllFoodAPI',
  async (_, {rejectWithValue}) => {
    try {
      const response = await api.get('/foods/getAll');
      return response.data;
    } catch (error: any) {
      console.log(
        'Errorrrr fooood:',
        error.message,
       'Data',
        error.response?.data,
      );
      return rejectWithValue(error.response?.data);
    }
  },
);

//Get food by id
export const getFoodByIdAPI = createAsyncThunk(
  'food/getFoodByIdAPI',
  async (userId: string, {rejectWithValue}) => {
    try {
      const response = await api.get(`/foods/getFoodByUserId/${userId}`);
      return response.data;
    } catch (error: any) {
      console.log(
        'Errorrrr fooood:',
        error.message,
       'Data',
        error.response?.data,
      );
      return rejectWithValue(error.response?.data);
    }
  },
);

export const deleteFoodAPI = createAsyncThunk(
  'food/deleteFoodAPI',
  async (foodId: string, {rejectWithValue}) => {
    try {
      const response = await api.delete(`/foods/delete/${foodId}`);
      return response.data;
    } catch (error: any) {
      console.log(
        'Errorrrr fooood:',
        error.message,
       'Data',
        error.response?.data,
      );
      return rejectWithValue(error.response?.data);
    }
  },
);
