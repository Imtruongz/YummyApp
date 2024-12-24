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
    deleteFood(state, action: PayloadAction<food>) {
      state.foods = state.foods.filter((food) => food.id !== action.payload.id);
    },
  },

});
export const {addFood} = foodSlice.actions;
export default foodSlice.reducer;
