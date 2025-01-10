import {createSlice} from '@reduxjs/toolkit';

import {addCommentToFoodAPI, deleteCommentAPI, getAllCommentFromFoodIdAPI} from './reviewThunk';

import {reviewState} from './types';

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
    builder.addCase(addCommentToFoodAPI.pending, state => {
      state.isLoadingReview = true;
      state.isErrorReview = false;
    });
    builder.addCase(addCommentToFoodAPI.fulfilled, (state, action) => {
      state.reviewList.push(action.payload);
      state.isLoadingReview = false;
      state.isErrorReview = false;
    });
    builder.addCase(addCommentToFoodAPI.rejected, state => {
      state.isLoadingReview = false;
      state.isErrorReview = true;
    });
    // Get all comment from food id
    builder.addCase(getAllCommentFromFoodIdAPI.pending, state => {
      state.isLoadingReview = true;
      state.isErrorReview = false;
    });
    builder.addCase(getAllCommentFromFoodIdAPI.fulfilled, (state, action) => {
      state.foodReviewList = action.payload;
      state.isLoadingReview = false;
      state.isErrorReview = false;
    });
    builder.addCase(getAllCommentFromFoodIdAPI.rejected, state => {
      state.isLoadingReview = false;
      state.isErrorReview = true;
    });
    //Delete comment
    builder.addCase(deleteCommentAPI.pending, state => {
      state.isLoadingReview = true;
      state.isErrorReview = false;
    });
    builder.addCase(deleteCommentAPI.fulfilled, (state, action) => {
      const deletedReviewId = action.payload.reviewId;
      state.foodReviewList = state.foodReviewList.filter(
        review => review.reviewId !== deletedReviewId, // Remove the deleted comment
      );
      state.isLoadingReview = false;
      state.isErrorReview = false;
    });
    builder.addCase(deleteCommentAPI.rejected, state => {
      state.isLoadingReview = false;
      state.isErrorReview = true;
    });
  },
});

export default reviewSlice.reducer;
