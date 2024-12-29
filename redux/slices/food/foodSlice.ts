import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {getAllFoodAPI} from './foodThunk';
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
  },
});

export default foodSlice.reducer;
