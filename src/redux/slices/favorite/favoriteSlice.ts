import { createSlice } from '@reduxjs/toolkit';
import { FavoriteFoodState } from './types';
import { 
  getAllFavoriteFoodsAPI, 
  addFavoriteFoodAPI, 
  deleteFavoriteFoodAPI 
} from './favoriteThunk';

const initialState: FavoriteFoodState = {
  favoriteFoodList: [],
  isLoadingFavorite: false,
  isErrorFavorite: false,
};

const favoriteSlice = createSlice({
  name: 'favorite',
  initialState,
  reducers: {},
  extraReducers(builder) {
    // Get all favorite foods
    builder.addCase(getAllFavoriteFoodsAPI.pending, state => {
      state.isLoadingFavorite = true;
      state.isErrorFavorite = false;
    });
    builder.addCase(getAllFavoriteFoodsAPI.fulfilled, (state, action) => {
      state.favoriteFoodList = action.payload;
      state.isLoadingFavorite = false;
      state.isErrorFavorite = false;
    });
    builder.addCase(getAllFavoriteFoodsAPI.rejected, state => {
      state.isLoadingFavorite = false;
      state.isErrorFavorite = true;
    });
    
    // Add favorite food
    builder.addCase(addFavoriteFoodAPI.pending, state => {
      state.isLoadingFavorite = true;
      state.isErrorFavorite = false;
    });
    builder.addCase(addFavoriteFoodAPI.fulfilled, (state, action) => {
      state.favoriteFoodList.push(action.payload);
      state.isLoadingFavorite = false;
      state.isErrorFavorite = false;
    });
    builder.addCase(addFavoriteFoodAPI.rejected, state => {
      state.isLoadingFavorite = false;
      state.isErrorFavorite = true;
    });
    
    // Delete favorite food
    builder.addCase(deleteFavoriteFoodAPI.pending, state => {
      state.isLoadingFavorite = true;
      state.isErrorFavorite = false;
    });
    builder.addCase(deleteFavoriteFoodAPI.fulfilled, (state, action) => {
      state.favoriteFoodList = state.favoriteFoodList.filter(
        favorite => favorite.favoriteFoodId !== action.payload.favoriteFoodId
      );
      state.isLoadingFavorite = false;
      state.isErrorFavorite = false;
    });
    builder.addCase(deleteFavoriteFoodAPI.rejected, state => {
      state.isLoadingFavorite = false;
      state.isErrorFavorite = true;
    });
  },
});

export default favoriteSlice.reducer; 