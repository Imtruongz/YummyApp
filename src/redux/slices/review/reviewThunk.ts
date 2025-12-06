import {createAsyncThunk} from '@reduxjs/toolkit';
import {review, reviewPayload} from './types';
import api from '@/api/config';

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
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Unexpected error occurred';
      return thunkAPI.rejectWithValue(errorMessage);
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
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Unexpected error occurred';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  },
);


