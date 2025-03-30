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

const initialState: foodState = {
  foodList: [],
  userFoodList: [],
  categoryFoodList: [],
  selectedFood: null,
  isLoadingFood: false,
  isErrorFood: false,
};

const foodSlice = createSlice({
  name: 'food',
  initialState,
  reducers: {},
  extraReducers(builder) {
    // Get all food
    builder.addCase(getAllFoodAPI.pending, state => {
      state.isLoadingFood = true;
      state.isErrorFood = false;
    });
    builder.addCase(getAllFoodAPI.fulfilled, (state, action) => {
      state.foodList = action.payload;
      state.isLoadingFood = false;
      state.isErrorFood = false;
    });
    builder.addCase(getAllFoodAPI.rejected, state => {
      state.isLoadingFood = false;
      state.isErrorFood = true;
    });
    // Get food by id
    builder.addCase(getFoodByIdAPI.pending, state => {
      state.isLoadingFood = true;
      state.isErrorFood = false;
    });
    builder.addCase(getFoodByIdAPI.fulfilled, (state, action) => {
      state.userFoodList = action.payload;
      state.isLoadingFood = false;
      state.isErrorFood = false;
    });
    builder.addCase(getFoodByIdAPI.rejected, state => {
      state.isLoadingFood = false;
      state.isErrorFood = true;
    });
    // Add food
    builder.addCase(addFoodAPI.pending, state => {
      state.isLoadingFood = true;
      state.isErrorFood = false;
    });
    builder.addCase(
      addFoodAPI.fulfilled,
      (state, action) => {
        if (action.payload) {
          state.foodList.push(action.payload);
          state.userFoodList.push(action.payload);
        }
        state.isLoadingFood = false;
        state.isErrorFood = false;
      },
    );
    builder.addCase(addFoodAPI.rejected, state => {
      state.isLoadingFood = false;
      state.isErrorFood = true;
    });
    // Delete the food
    builder.addCase(deleteFoodAPI.pending, state => {
      state.isLoadingFood = true;
      state.isErrorFood = false;
    });
    builder.addCase(
      deleteFoodAPI.fulfilled,
      (state, action) => {
        state.foodList = state.foodList.filter(
          food => food.foodId !== action.payload,
        );
        state.userFoodList = state.userFoodList.filter(
          food => food.foodId !== action.payload,
        );

        state.isLoadingFood = false;
        state.isErrorFood = false;
      },
    );

    builder.addCase(deleteFoodAPI.rejected, state => {
      state.isLoadingFood = false;
      state.isErrorFood = true;
    });
    //Get detail food
    builder.addCase(getDetailFoodAPI.pending, state => {
      state.isLoadingFood = true;
      state.isErrorFood = false;
      state.selectedFood = null;
    });
    builder.addCase(getDetailFoodAPI.fulfilled, (state, action) => {
      if (action.payload) {
        state.selectedFood = action.payload;
      } else {
        state.selectedFood = null;
      }
      state.isLoadingFood = false;
      state.isErrorFood = false;
    });
    builder.addCase(getDetailFoodAPI.rejected, state => {
      state.isLoadingFood = false;
      state.isErrorFood = true;
    });

    // Get food by category
    builder.addCase(getFoodByCategoryAPI.pending, state => {
      state.isLoadingFood = true;
      state.isErrorFood = false;
    });
    builder.addCase(getFoodByCategoryAPI.fulfilled, (state, action) => {
      state.categoryFoodList = action.payload || [];
      state.isLoadingFood = false;
      state.isErrorFood = false;
    });
    builder.addCase(getFoodByCategoryAPI.rejected, state => {
      state.isLoadingFood = false;
      state.isErrorFood = true;
    });
  },
});

export default foodSlice.reducer;
