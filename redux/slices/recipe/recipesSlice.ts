import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {recipes} from '../recipe/types';

interface recipesState {
  recipes: recipes[];
}

const initialState: recipesState = {
  recipes: [],
};

const recipesSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    //Add recipes to the state
    addRecipes: (state, action: PayloadAction<recipes>) => {
      state.recipes.push(action.payload);
    },
  },
});

export const {addRecipes} = recipesSlice.actions;

export default recipesSlice.reducer;
