import {createSlice} from '@reduxjs/toolkit';
import {
  getAllFoodAPI,
  getFoodByIdAPI,
  addFoodAPI,
  deleteFoodAPI,
  getDetailFoodAPI,
  getFoodByCategoryAPI,
} from './foodThunk';
import {foodState} from './types';
import { createAsyncThunkHandler } from '../../utils/asyncThunkHandler';

const initialState: foodState = {
  foodList: [],
  userFoodList: [],
  viewedUserFoodList: [],
  categoryFoodList: [],
  selectedFood: null,
  isLoadingFood: false,
  isErrorFood: false,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasNextPage: false,
  }
};

const foodSlice = createSlice({
  name: 'food',
  initialState,
  reducers: {
    resetViewedUserFoodList: (state) => {
      state.viewedUserFoodList = [];
    },
  },
  extraReducers(builder) {
    // Get all food
    createAsyncThunkHandler(builder, getAllFoodAPI, {
      loadingKey: 'isLoadingFood',
      onFulfilled: (state, action) => {
        // Nếu là trang 1, replace; nếu không thì append
        if (action.payload.pagination.page === 1) {
          state.foodList = action.payload.data;
        } else {
          state.foodList = [...state.foodList, ...action.payload.data];
        }
        state.pagination = action.payload.pagination;
      },
    });

    // Get food by id
    createAsyncThunkHandler(builder, getFoodByIdAPI, {
      loadingKey: 'isLoadingFood',
      onFulfilled: (state, action) => {
        if (action.payload.isViewMode) {
          state.viewedUserFoodList = action.payload.data || [];
        } else {
          state.userFoodList = action.payload.data || [];
        }
      },
    });

    // Add food - using upsert pattern to prevent duplicates
    createAsyncThunkHandler(builder, addFoodAPI, {
      loadingKey: 'isLoadingFood',
      onFulfilled: (state, action) => {
        if (action.payload) {
          const foodId = action.payload.foodId;
          
          // Upsert pattern - remove if exists, then add
          state.foodList = state.foodList.filter(food => food.foodId !== foodId);
          state.foodList.push(action.payload);
          
          state.userFoodList = state.userFoodList.filter(food => food.foodId !== foodId);
          state.userFoodList.push(action.payload);
        }
      },
    });

    // Delete food
    createAsyncThunkHandler(builder, deleteFoodAPI, {
      loadingKey: 'isLoadingFood',
      onFulfilled: (state, action) => {
        const foodId = action.payload;
        state.foodList = state.foodList.filter(food => food.foodId !== foodId);
        state.userFoodList = state.userFoodList.filter(food => food.foodId !== foodId);
      },
    });

    // Get detail food
    createAsyncThunkHandler(builder, getDetailFoodAPI, {
      loadingKey: 'isLoadingFood',
      onFulfilled: (state, action) => {
        state.selectedFood = action.payload || null;
      },
    });

    // Get food by category
    createAsyncThunkHandler(builder, getFoodByCategoryAPI, {
      loadingKey: 'isLoadingFood',
      onFulfilled: (state, action) => {
        state.categoryFoodList = action.payload || [];
      },
    });
  },
});

export const { resetViewedUserFoodList } = foodSlice.actions;

export default foodSlice.reducer;
