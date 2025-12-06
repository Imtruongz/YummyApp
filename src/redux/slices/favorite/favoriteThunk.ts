import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/api/config';
import { FavoriteFood, FavoriteFoodPayload, DeleteFavoriteFoodPayload } from './types';

export const getAllFavoriteFoodsAPI = createAsyncThunk(
  'favorite/getAllFavoriteFoodsAPI',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await api.get<{ data: FavoriteFood[] }>(`/favoriteFoods/getAll/${userId}`);
      return response.data.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Unexpected error occurred';
      return rejectWithValue(errorMessage);
    }
  },
);

export const addFavoriteFoodAPI = createAsyncThunk(
  'favorite/addFavoriteFoodAPI',
  async (payload: FavoriteFoodPayload, { rejectWithValue }) => {
    try {
      const response = await api.post<{ data: FavoriteFood }>('/favoriteFoods/add', payload);
      return response.data.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Unexpected error occurred';
      return rejectWithValue(errorMessage);
    }
  },
);

export const deleteFavoriteFoodAPI = createAsyncThunk(
  'favorite/deleteFavoriteFoodAPI',
  async (payload: DeleteFavoriteFoodPayload, { rejectWithValue }) => {
    try {
      const response = await api.delete<{ data: FavoriteFood }>('/favoriteFoods/delete', { 
        data: payload 
      });
      return response.data.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Unexpected error occurred';
      return rejectWithValue(errorMessage);
    }
  },
); 