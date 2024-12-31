import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {getAllFoodAPI, getFoodByIdAPI, deleteFoodAPI} from './foodThunk';
import {foodState, food} from './types';

const initialState: foodState = {
  foodList: [],
  isLoadingFood: false,
  isErrorFood: false,
};

const foodSlice = createSlice({
  name: 'food',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // Get all food
    builder.addCase(getAllFoodAPI.pending, state => {
      state.isLoadingFood = true;
      state.isErrorFood = false;
    });
    builder.addCase(
      getAllFoodAPI.fulfilled,
      (state, action: PayloadAction<food[]>) => {
        state.foodList = action.payload;
        state.isLoadingFood = false;
        state.isErrorFood = false;
      },
    );
    builder.addCase(getAllFoodAPI.rejected, state => {
      state.isLoadingFood = false;
      state.isErrorFood = true;
    });
    // Get food by id
    builder.addCase(getFoodByIdAPI.pending, state => {
      state.isLoadingFood = true;
      state.isErrorFood = false;
    });
    builder.addCase(
      getFoodByIdAPI.fulfilled,
      (state, action: PayloadAction<food[]>) => {
        state.foodList = action.payload;
        state.isLoadingFood = false;
        state.isErrorFood = false;
      },
    );
    builder.addCase(getFoodByIdAPI.rejected, state => {
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
      (state, action: PayloadAction<food[]>) => {
        state.foodList = action.payload; // This is not correct
        //Find the food index that we want to delete
        const deleteFoodIndex = state.foodList.findIndex(
          food => food.foodId === action.payload[0].foodId,
        );
        if(deleteFoodIndex !== -1) {
          state.foodList.splice(deleteFoodIndex, 1);
        }
        state.isLoadingFood = false;
        state.isErrorFood = false;
      },
    );
    builder.addCase(deleteFoodAPI.rejected, state => {
      state.isLoadingFood = false;
      state.isErrorFood = true;
    });
  },
});

export default foodSlice.reducer;
