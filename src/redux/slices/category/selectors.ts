import { RootState } from '../../store';

/**
 * Selectors for categories slice
 */

export const selectCategoriesState = (state: RootState) => state.categories;

export const selectCategoryList = (state: RootState) => state.categories.categoryList;

export const selectIsLoadingCategory = (state: RootState) => state.categories.isLoadingCategory;

export const selectCategoryError = (state: RootState) => state.categories.isErrorCategory;

export const selectCategoryById = (categoryId: string) => (state: RootState) => 
  state.categories.categoryList.find(cat => cat.categoryId === categoryId);
