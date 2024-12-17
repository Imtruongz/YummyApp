import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface food {
  id: string;
  name: string;
  ingredients: string;
  instructions: string;
}

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
    removeFood(state, action: PayloadAction<string>) {
      state.foods = state.foods.filter(food => food.id !== action.payload);
    },
  },
});

export const { addFood , removeFood } = foodSlice.actions;
export default foodSlice.reducer;
