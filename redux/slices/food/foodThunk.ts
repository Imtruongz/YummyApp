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
      return thunkAPI.rejectWithValue(
        error.response?.data || 'Unexpected error occurred',
      );
    }
  },
);

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

export const addFoodAPI = createAsyncThunk(
  'food/addFoodAPI',
  async (newFood: food, thunkAPI) => {
    try {
      const response = await api.post<food>('/foods/add', newFood, {
        signal: thunkAPI.signal,
      });
      if (!response || !response.data) {
        console.error('No data returned from the server for addFoodAPI');
        return thunkAPI.rejectWithValue('No data returned from the server');
      }
      return response.data;
    } catch (error: any) {
      console.log(
        'Errorrrr fooood:',
        error.message,
        'Data',
        error.response?.data,
      );
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

export const getDetailFoodAPI = createAsyncThunk(
  'food/getDetailFoodAPI',
  async (foodId: string, thunkAPI) => {
    try {
      const response = await api.get<food>(`/foods/getDetail/${foodId}`, {
        signal: thunkAPI.signal,
      });
      if (!response || !response.data) {
        console.error('No data returned from the server for addFoodAPI');
        return thunkAPI.rejectWithValue('No data returned from the server');
      }
      console.log('Data from getDetailFoodAPI:', response.data);
      return response.data;
    } catch (error: any) {
      console.log(
        'Error food from getDetailFoodAPI:',
        error.message,
        'Data from getDetailFoodAPI',
        error.response?.data,
      );
    }
  },
);
