import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/api/config';
import { RatingPayload, RatingStats, UserRating } from './types';

// Get average rating for a food
export const getAverageRatingAPI = createAsyncThunk(
  'rating/getAverageRatingAPI',
  async (foodId: string, thunkAPI) => {
    try {
      const response = await api.get<any>(
        `/ratings/getAverageRating/${foodId}`,
        {
          signal: thunkAPI.signal,
        },
      );
      return response.data.data as RatingStats;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Unexpected error occurred';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  },
);

// Add or update rating for a food
export const addOrUpdateRatingAPI = createAsyncThunk(
  'rating/addOrUpdateRatingAPI',
  async (ratingData: RatingPayload, thunkAPI) => {
    try {
      const response = await api.post<any>(
        '/ratings/addOrUpdate',
        ratingData,
        {
          signal: thunkAPI.signal,
        },
      );
      return response.data.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Unexpected error occurred';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  },
);

// Get user's rating for a specific food
export const getUserRatingAPI = createAsyncThunk(
  'rating/getUserRatingAPI',
  async (params: { foodId: string; userId: string }, thunkAPI) => {
    try {
      const response = await api.get<any>(
        `/ratings/getUserRating/${params.foodId}/${params.userId}`,
        {
          signal: thunkAPI.signal,
        },
      );
      return response.data.data as UserRating;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Unexpected error occurred';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  },
);
