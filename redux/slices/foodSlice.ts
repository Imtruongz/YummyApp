import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {initialFoodState} from '../../plugins/foodDB';

interface food {
  id: string;
  name: string;
  ingredients: string;
  step: string;
  image?: string;
}

interface foodState {
  foods: food[];
}

const initialState: foodState = {
  foods: initialFoodState,
};

const foodSlice = createSlice({
  //Action type
  name: 'food',
  //Inital state
  initialState,
  //Reducers generate actions
  reducers: {
    addFood(state, action: PayloadAction<food>) {
      state.foods.push(action.payload);
    },
    removeFood(state, action: PayloadAction<string>) {
      state.foods = state.foods.filter(food => food.id !== action.payload);
    },
  },
});

//Export actions
export const {addFood, removeFood} = foodSlice.actions;
//Export reducer
export default foodSlice.reducer;
//Export state
export type {food};
