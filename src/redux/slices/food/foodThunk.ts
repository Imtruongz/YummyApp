import {createAsyncThunk} from '@reduxjs/toolkit';
import {food, foodPayload} from './types';
import api from '@/api/config';

export const getAllFoodAPI = createAsyncThunk(
  'food/getAllFoodAPI',
  async ({page = 1, limit = 10}: {page?: number, limit?: number} = {}, thunkAPI) => {
    try {
      const response = await api.get<{data: food[], pagination: any}>('/foods/getAll', {
        params: { page, limit },
        signal: thunkAPI.signal,
      });
      if (!response.data || !response.data.data || response.data.data.length === 0) {
        return thunkAPI.rejectWithValue('No data returned from the server');
      }
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Unexpected error occurred';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  },
);

export const searchFoodAPI = createAsyncThunk(
  'food/searchFoodAPI',
  async ({query = '', page = 1, limit = 10}: {query?: string, page?: number, limit?: number} = {}, thunkAPI) => {
    try {
      console.log('SearchFoodAPI action')
      const response = await api.get<{data: food[], pagination: any}>('/foods/search', {
        params: { q: query, page, limit },
        signal: thunkAPI.signal,
      });
      console.log('Response:', response); 
      if (!response.data) {
        return thunkAPI.rejectWithValue('No data returned from the server');
      }
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Search failed';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  },
);
export const getFoodByIdAPI = createAsyncThunk(
  'food/getFoodByIdAPI',
  async ({userId, isViewMode = false}: {userId: string, isViewMode?: boolean}, {rejectWithValue}) => {
    try {
      const response = await api.get<food[]>(
        `/foods/getFoodByUserId/${userId}`,
      );
      return {
        data: response.data,
        isViewMode
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Unexpected error occurred';
      return rejectWithValue(errorMessage);
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
        return thunkAPI.rejectWithValue('No data returned from the server');
      }
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Unexpected error occurred';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  },
);

export const deleteFoodAPI = createAsyncThunk(
  'food/deleteFoodAPI',
  async (foodId: string, {rejectWithValue}) => {
    try {
      const response = await api.delete(`/foods/delete/${foodId}`);
      if (!response || !response.data) {
        return rejectWithValue('No data returned from the server');
      }
      return foodId;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to delete food';
      return rejectWithValue(errorMessage);
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
        return thunkAPI.rejectWithValue('No data returned from the server');
      }
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Unexpected error occurred';
      return thunkAPI.rejectWithValue(errorMessage);
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
        return thunkAPI.rejectWithValue('No data returned from the server');
      }
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Unexpected error occurred';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  },
);

export const updateFoodAPI = createAsyncThunk(
  'food/updateFoodAPI',
  async (updatedFood: food & {userId: string}, thunkAPI) => {
    try {
      const response = await api.put<food>('/foods/update', updatedFood, {
        signal: thunkAPI.signal,
      });
      if (!response || !response.data) {
        return thunkAPI.rejectWithValue('No data returned from the server');
      }
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to update food';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  },
);
