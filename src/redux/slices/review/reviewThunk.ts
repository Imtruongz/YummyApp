import {createAsyncThunk} from '@reduxjs/toolkit';
import {review, reviewPayload} from './types';
import api from '../../../api/config';

export const addCommentToFoodAPI = createAsyncThunk(
  'review/addCommentToFoodAPI',
  async (newReview: reviewPayload, thunkAPI) => {
    try {
      const response = await api.post<review>(
        '/foodReviews/addComment',
        newReview,
        {
          signal: thunkAPI.signal,
        },
      );
      if (!response || !response.data) {
        console.log(
          'No data returned from the server for addCommentToFoodAPI',
        );
        return thunkAPI.rejectWithValue('No data returned from the server');
      }
      console.log('Data from addCommentToFoodAPI:', response.data);
      return response.data;
    } catch (error: any) {
      console.log(
        'Error from addCommentToFoodAPI',
        error.message,
        'Response data error from addCommentToFoodAPI',
        error.response?.data,
      );
      return thunkAPI.rejectWithValue(
        error.response?.data || 'Unexpected error occurred',
      );
    }
  },
);

export const getAllCommentFromFoodIdAPI = createAsyncThunk(
  'review/getAllCommentFromFoodIdAPI',
  async (foodId: string, thunkAPI) => {
    try {
      const response = await api.get<review[]>(
        `/foodReviews/getComment/${foodId}`,
        {
          signal: thunkAPI.signal,
        },
      );
      return response.data;
    } catch (error: any) {
      console.log('Error from getAllCommentFromFoodIdAPI', error.message);
      return thunkAPI.rejectWithValue(
        error.response?.data || 'Unexpected error occurred',
      );
    }
  },
);

export const deleteCommentAPI = createAsyncThunk(
  'review/deleteCommentAPI',
  async (reviewId: string, thunkAPI) => {
    try {
      const response = await api.delete<review>(
        `/foodReviews/deleteComment/${reviewId}`,
        {
          signal: thunkAPI.signal,
        },
      );
      return response.data;
    } catch (error: any) {
      console.log('Error from deleteCommentAPI', error.message.data);
      return thunkAPI.rejectWithValue(
        error.response?.data || 'Unexpected error occurred',
      );
    }
  },
);

// Thunk để lấy average rating của 1 food
export interface RatingStats {
  averageRating: number;
  totalRatings: number;
}

export const getAverageRatingAPI = createAsyncThunk(
  'review/getAverageRatingAPI',
  async (foodId: string, thunkAPI) => {
    try {
      const response = await api.get<any>(
        `/ratings/getAverageRating/${foodId}`,
        {
          signal: thunkAPI.signal,
        },
      );
      return response.data.data;
    } catch (error: any) {
      console.log('Error from getAverageRatingAPI', error.message);
      return thunkAPI.rejectWithValue(
        error.response?.data || 'Unexpected error occurred',
      );
    }
  },
);

// Thunk để add hoặc update rating
export interface RatingPayload {
  foodId: string;
  userId: string;
  rating: number;
}

export const addOrUpdateRatingAPI = createAsyncThunk(
  'review/addOrUpdateRatingAPI',
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
      console.log('Error from addOrUpdateRatingAPI', error.message);
      return thunkAPI.rejectWithValue(
        error.response?.data || 'Unexpected error occurred',
      );
    }
  },
);

// Thunk để lấy rating của user cho 1 food
export const getUserRatingAPI = createAsyncThunk(
  'review/getUserRatingAPI',
  async (params: {foodId: string; userId: string}, thunkAPI) => {
    try {
      const response = await api.get<any>(
        `/ratings/getUserRating/${params.foodId}/${params.userId}`,
        {
          signal: thunkAPI.signal,
        },
      );
      return response.data.data;
    } catch (error: any) {
      console.log('Error from getUserRatingAPI', error.message);
      return thunkAPI.rejectWithValue(
        error.response?.data || 'Unexpected error occurred',
      );
    }
  },
);

