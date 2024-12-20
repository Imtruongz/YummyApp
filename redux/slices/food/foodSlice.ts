import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import { food } from './types';

interface foodState {
  foods: food[];
}

const initialState: foodState = {
  foods: [],
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
  },
});

//Export actions
export const {addFood} = foodSlice.actions;
//Export reducer
export default foodSlice.reducer;
