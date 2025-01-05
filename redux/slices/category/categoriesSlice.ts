import {createSlice} from '@reduxjs/toolkit';
import {getAllCategoriesAPI} from './categoryThunk';
import {categoryState} from './types';

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
    builder.addCase(getAllCategoriesAPI.pending, state => {
      state.isLoadingCategory = true;
      state.isErrorCategory = false;
    });
    builder.addCase(getAllCategoriesAPI.fulfilled, (state, action) => {
      state.categoryList = action.payload;
      state.isLoadingCategory = false;
      state.isErrorCategory = false;
    });
    builder.addCase(getAllCategoriesAPI.rejected, state => {
      state.isLoadingCategory = false;
      state.isErrorCategory = true;
    });
  },
});

export default categoriesSlice.reducer;
