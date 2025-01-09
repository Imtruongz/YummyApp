import {createAsyncThunk} from '@reduxjs/toolkit';
import {food, foodPayload} from './types';
import api from '../../../api/api';

export const getAllFoodAPI = createAsyncThunk(
  'food/getAllFoodAPI',
  async (_, thunkAPI) => {
    try {
      const response = await api.get<food[]>('/foods/getAll', {
        signal: thunkAPI.signal,
      });
      if (!response.data || response.data.length === 0) {
        console.error('No data returned from the server for getAllFoodAPI');
        return thunkAPI.rejectWithValue('No data returned from the server');
      }
      return response.data;
    } catch (error: any) {
      console.error(
        'Error from getAllFoodAPI',
        error.message,
        'Response data error from getAllFoodAPI',
        error.response?.data,
      );
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
      const response = await api.get<food[]>(
        `/foods/getFoodByUserId/${userId}`,
      );
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
  async (newFood: foodPayload, thunkAPI) => {
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
      if (!response || !response.data) {
        console.error('No data returned from the server for deleteFoodAPI');
        return foodId;
      }
      return foodId;
    } catch (error: any) {
      console.error('Error deleting food:', error.message);
      return rejectWithValue(error.response?.data || 'Failed to delete food');
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
      return response.data;
    } catch (error: any) {
      console.log('Error from getDetailFoodAPI:', error.message);
    }
  },
);

export const getFoodByCategoryAPI = createAsyncThunk(
  'food/getFoodByCategoryAPI',
  async (categoryId: string, thunkAPI) => {
    try {
      const response = await api.get<food[]>(
        `/foods/getFoodsByCategory/${categoryId}`,
        {
          signal: thunkAPI.signal,
        },
      );
      if (!response || !response.data) {
        console.error(
          'No data returned from the server for getFoodByCategoryAPI',
        );
        return thunkAPI.rejectWithValue('No data returned from the server');
      }
      return response.data;
    } catch (error: any) {
      console.log(
        'Error food from getFoodByCategoryAPI:',
        error.message,
        'Data from getFoodByCategoryAPI',
        error.response?.data,
      );
    }
  },
);
