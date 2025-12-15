import { RootState } from '../../store';
import { food } from './types';

/**
 * Selectors for food slice
 * Centralize all food-related selectors for easy maintenance
 */

export const selectFoodState = (state: RootState) => state.food;

export const selectFoodList = (state: RootState): food[] => state.food.foodList;

export const selectSearchFoodList = (state: RootState): food[] => state.food.searchFoodList;

export const selectUserFoodList = (state: RootState): food[] => state.food.userFoodList;

export const selectViewedUserFoodList = (state: RootState): food[] => state.food.viewedUserFoodList;

export const selectCategoryFoodList = (state: RootState): food[] => state.food.categoryFoodList;

export const selectSelectedFood = (state: RootState): food | null => state.food.selectedFood;

export const selectIsLoadingFood = (state: RootState) => state.food.isLoadingFood;

export const selectFoodError = (state: RootState) => state.food.isErrorFood;

/**
 * Memoized selectors - tính toán dữ liệu dựa trên các selector khác
 */
export const selectFoodListWithLength = (state: RootState) => ({
  foods: state.food.foodList,
  count: state.food.foodList.length,
});
