import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { food } from './types';
interface foodState {
  foods: food[];
}
const initialState: foodState = {
  foods: [],
};
const foodSlice = createSlice({
  name: 'food',
  initialState,
  reducers: {
    addFood(state, action: PayloadAction<food>) {
      state.foods.push(action.payload);
    },
    deleteFood(state, action: PayloadAction<string>) {
      const foodId = action.payload;
      const foundFoodIndex = state.foods.findIndex(food => food.id === foodId);
      if(foundFoodIndex !== -1) {
        state.foods.splice(foundFoodIndex, 1);
      }
    },
  },

});
export const {addFood, deleteFood} = foodSlice.actions;
export default foodSlice.reducer;
