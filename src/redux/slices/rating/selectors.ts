import { RootState } from '../../store';

/**
 * Selectors for rating slice
 */

export const selectRatingState = (state: RootState) => state.rating;

export const selectIsLoadingRating = (state: RootState) => state.rating.isLoadingRating;

export const selectRatingError = (state: RootState) => state.rating.isErrorRating;
