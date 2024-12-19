import {createSlice} from '@reduxjs/toolkit';
import {Categories} from '../category/types';

interface categoryState {
  categories: Categories[];
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
