import { createSlice } from '@reduxjs/toolkit';
import { RatingState } from './types';
import { getAverageRatingAPI, addOrUpdateRatingAPI, getUserRatingAPI } from './ratingThunk';
import { createAsyncThunkHandler } from '../../utils/asyncThunkHandler';

const initialState: RatingState = {
  isLoadingRating: false,
  isErrorRating: false,
};

const ratingSlice = createSlice({
  name: 'rating',
  initialState,
  reducers: {},
  extraReducers(builder) {
    // Get average rating
    createAsyncThunkHandler(builder, getAverageRatingAPI, {
      loadingKey: 'isLoadingRating',
    });

    // Add or update rating
    createAsyncThunkHandler(builder, addOrUpdateRatingAPI, {
      loadingKey: 'isLoadingRating',
    });

    // Get user rating
    createAsyncThunkHandler(builder, getUserRatingAPI, {
      loadingKey: 'isLoadingRating',
    });
  },
});

export default ratingSlice.reducer;
