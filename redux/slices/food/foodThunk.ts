import {createAsyncThunk} from '@reduxjs/toolkit';
import {food} from './types';
import api from '../../../api/api';

export const getAllFoodAPI = createAsyncThunk(
  'food/getAllFoodAPI',
  async (_, thunkAPI) => {
    try {
      const response = await api.get<food[]>('/foods/getAll', {
        signal: thunkAPI.signal,
      });

      // Kiểm tra nếu response.data là undefined hoặc không hợp lệ
      if (!response.data || response.data.length === 0) {
        console.error('No data returned from the server for getAllFoodAPI');
        return thunkAPI.rejectWithValue('No data returned from the server');
      }

      // Trả về dữ liệu hợp lệ
      return response.data;
    } catch (error: any) {
      console.error(
        'Error from getAllFoodAPI',
        error.message,
        'Response data error from getAllFoodAPI',
        error.response?.data,
      );

      // Trả về thông báo lỗi qua rejectWithValue nếu cần
      return thunkAPI.rejectWithValue(error.response?.data || 'Unexpected error occurred');
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
