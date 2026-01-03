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
      errorKey: 'isErrorRating',
    });

    // Add or update rating
    createAsyncThunkHandler(builder, addOrUpdateRatingAPI, {
      loadingKey: 'isLoadingRating',
      errorKey: 'isErrorRating',
    });

    // Get user rating
    createAsyncThunkHandler(builder, getUserRatingAPI, {
      loadingKey: 'isLoadingRating',
      errorKey: 'isErrorRating',
    });
  },
});

export default ratingSlice.reducer;
