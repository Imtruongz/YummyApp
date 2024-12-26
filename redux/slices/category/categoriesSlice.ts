import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {categories} from '../category/types';
import api from '../../../api/api';

interface categoryState {
  ListCategories: categories[];
  isloadingCategories?: boolean;
  isErrorCategories?: boolean;
}

const initialState: categoryState = {
  ListCategories: [],
  isloadingCategories: false,
  isErrorCategories: false,
};

export const categoriesAPI = createAsyncThunk(
  'categories/categoriesAPI',
  async () => {
    const response = await api.get('/json/v1/1/categories.php');
    return response.data;
  },
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(categoriesAPI.pending, state => {
      state.isloadingCategories = true;
      state.isErrorCategories = false;
    });
    builder.addCase(categoriesAPI.fulfilled, (state, action) => {
      state.ListCategories = action.payload;
      state.isloadingCategories = false;
      state.isErrorCategories = false;
    });
    builder.addCase(categoriesAPI.rejected, (state) => {
      state.isloadingCategories = false;
      state.isErrorCategories = true;
    });
  },
});

export const {} = categoriesSlice.actions;

export default categoriesSlice.reducer;
