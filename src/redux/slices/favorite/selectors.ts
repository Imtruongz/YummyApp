import { RootState } from '../../store';

/**
 * Selectors for favorite slice
 */

export const selectFavoriteState = (state: RootState) => state.favorite;

export const selectFavoriteFoodList = (state: RootState) => state.favorite.favoriteFoodList;

export const selectIsLoadingFavorite = (state: RootState) => state.favorite.isLoadingFavorite;

export const selectFavoriteError = (state: RootState) => state.favorite.isErrorFavorite;

export const selectFavoriteFoodCount = (state: RootState) => state.favorite.favoriteFoodList.length;

export const selectIsFoodFavorited = (foodId: string) => (state: RootState) =>
  state.favorite.favoriteFoodList.some(fav => fav.foodId === foodId);
