import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../api/config';
import { FavoriteFood, FavoriteFoodPayload, DeleteFavoriteFoodPayload } from './types';

export const getAllFavoriteFoodsAPI = createAsyncThunk(
  'favorite/getAllFavoriteFoodsAPI',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await api.get<{ data: FavoriteFood[] }>(`/favoriteFoods/getAll/${userId}`);
      return response.data.data;
    } catch (error: any) {
      console.log(
        'Error from getAllFavoriteFoodsAPI:',
        error.message,
        'Data',
        error.response?.data,
      );
      return rejectWithValue(error.response?.data);
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
      console.log(
        'Error from addFavoriteFoodAPI:',
        error.message,
        'Data',
        error.response?.data,
      );
      return rejectWithValue(error.response?.data);
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
      console.log(
        'Error from deleteFavoriteFoodAPI:',
        error.message,
        'Data',
        error.response?.data,
      );
      return rejectWithValue(error.response?.data);
    }
  },
); 