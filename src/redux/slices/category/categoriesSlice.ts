import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {getAllCategoriesAPI} from './categoryThunk';
import {categoryState, category} from './types';
import { createAsyncThunkHandler } from '../../utils/asyncThunkHandler';

const initialState: categoryState = {
  categoryList: [],
  isLoadingCategory: false,
  isErrorCategory: false,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: builder => {
    createAsyncThunkHandler(builder, getAllCategoriesAPI, {
      onFulfilled: (state, action: PayloadAction<category[]>) => {
        state.categoryList = action.payload;
      },
    });
  },
});

export default categoriesSlice.reducer;
