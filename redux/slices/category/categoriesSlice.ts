import {createSlice} from '@reduxjs/toolkit';
import {categories} from '../category/types';

interface categoryState {
  categories: categories[];
}

const initialState: categoryState = {
  categories: [],
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
});

export const {} = categoriesSlice.actions;

export default categoriesSlice.reducer;
