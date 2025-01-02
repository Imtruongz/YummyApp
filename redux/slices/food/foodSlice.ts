import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {getAllFoodAPI, getFoodByIdAPI , addFoodAPI , deleteFoodAPI, getDetailFoodAPI} from './foodThunk';
import {foodState, food} from './types';

const initialState: foodState = {
  foodList: [],
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
    builder.addCase(
      getAllFoodAPI.fulfilled,
      (state, action) => {
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

    // Add food
    builder.addCase(addFoodAPI.pending, state => {
      state.isLoadingFood = true;
      state.isErrorFood = false;
    });
    builder.addCase(
      addFoodAPI.fulfilled,
      (state, action: PayloadAction<food | undefined>) => {
        if (action.payload) {
          state.foodList.push(action.payload);
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
      (state, action: PayloadAction<food[]>) => {
        state.foodList = action.payload; // This is not correct
        //Find the food index that we want to delete
        const deleteFoodIndex = state.foodList.findIndex(
          food => food.foodId === action.payload[0].foodId,
        );
        if (deleteFoodIndex !== -1) {
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
  },
});

export default foodSlice.reducer;
