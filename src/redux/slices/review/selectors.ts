import { RootState } from '../../store';

/**
 * Selectors for review slice
 */

export const selectReviewState = (state: RootState) => state.review;

export const selectReviewList = (state: RootState) => state.review.reviewList;

export const selectUserReviewList = (state: RootState) => state.review.userReviewList;

export const selectFoodReviewList = (state: RootState) => state.review.foodReviewList;

export const selectSelectedReview = (state: RootState) => state.review.selectedReview;

export const selectIsLoadingReview = (state: RootState) => state.review.isLoadingReview;

export const selectReviewError = (state: RootState) => state.review.isErrorReview;

export const selectFoodReviewCount = (state: RootState) => state.review.foodReviewList.length;
