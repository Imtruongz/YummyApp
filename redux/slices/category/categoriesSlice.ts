import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {categories} from '../category/types';
import api from '../../../api/api';

interface categoryState {
  categories: categories[];
  loading?: boolean;
  error: string | null;
}

const initialState: categoryState = {
  categories: [],
  loading: false,
  error: null,
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
      state.loading = true;
      state.error = null;
    });
    builder.addCase(categoriesAPI.fulfilled, (state, action) => {
      state.categories = action.payload;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(categoriesAPI.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ? action.error.message : 'Error';
    });
  },
});

export const {} = categoriesSlice.actions;

export default categoriesSlice.reducer;
