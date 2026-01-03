import {createSlice} from '@reduxjs/toolkit';

import {addCommentToFoodAPI, deleteCommentAPI, getAllCommentFromFoodIdAPI} from './reviewThunk';

import {reviewState} from './types';
import { createAsyncThunkHandler } from '../../utils/asyncThunkHandler';

const initialState: reviewState = {
  reviewList: [],
  userReviewList: [],
  foodReviewList: [],
  selectedReview: null,
  isLoadingReview: false,
  isErrorReview: false,
};

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {},
  extraReducers(builder) {
    // Add comment to food
    createAsyncThunkHandler(builder, addCommentToFoodAPI, {
      loadingKey: 'isLoadingReview',
      errorKey: 'isErrorReview',
      onFulfilled: (state, action) => {
        state.reviewList.push(action.payload);
      },
    });

    // Get all comment from food id
    createAsyncThunkHandler(builder, getAllCommentFromFoodIdAPI, {
      loadingKey: 'isLoadingReview',
      errorKey: 'isErrorReview',
      onFulfilled: (state, action) => {
        state.foodReviewList = action.payload;
      },
    });

    // Delete comment
    createAsyncThunkHandler(builder, deleteCommentAPI, {
      loadingKey: 'isLoadingReview',
      errorKey: 'isErrorReview',
      onFulfilled: (state, action) => {
        const deletedReviewId = action.payload.reviewId;
        state.foodReviewList = state.foodReviewList.filter(
          review => review.reviewId !== deletedReviewId,
        );
      },
    });
  },
});

export default reviewSlice.reducer;

