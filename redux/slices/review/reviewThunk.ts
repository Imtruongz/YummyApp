import {createAsyncThunk} from '@reduxjs/toolkit';
import {review, reviewPayload} from './types';
import api from '../../../api/api';

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
        console.error(
          'No data returned from the server for addCommentToFoodAPI',
        );
        return thunkAPI.rejectWithValue('No data returned from the server');
      }
      console.log('Data from addCommentToFoodAPI:', response.data);
      return response.data;
    } catch (error: any) {
      console.error(
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
      console.log('Dataaaaaaaa:', response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        'Error from getAllCommentFromFoodIdAPI',
        error.message,
        'Response data error from getAllCommentFromFoodIdAPI',
        error.response?.data,
      );
      return thunkAPI.rejectWithValue(
        error.response?.data || 'Unexpected error occurred',
      );
    }
  },
);
