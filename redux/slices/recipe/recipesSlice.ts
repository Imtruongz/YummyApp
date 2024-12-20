import {createSlice} from '@reduxjs/toolkit';

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
  reducers: {},
});

export const {} = recipesSlice.actions;

export default recipesSlice.reducer;
