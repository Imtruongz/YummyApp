import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {meal} from '../recipe/types';

interface recipesState {
  recipes: meal[];
}

const initialState: recipesState = {
  recipes: [],
};

const recipesSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    //Add recipes to the state
    addRecipes: (state, action: PayloadAction<meal>) => {
      state.recipes.push(action.payload);
    },
  },
});

export const {addRecipes} = recipesSlice.actions;

export default recipesSlice.reducer;
