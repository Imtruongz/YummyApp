import { createSlice } from '@reduxjs/toolkit';
import { FavoriteFoodState } from './types';
import { 
  getAllFavoriteFoodsAPI, 
  addFavoriteFoodAPI, 
  deleteFavoriteFoodAPI 
} from './favoriteThunk';
import { createAsyncThunkHandler } from '../../utils/asyncThunkHandler';

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
    createAsyncThunkHandler(builder, getAllFavoriteFoodsAPI, {
      loadingKey: 'isLoadingFavorite',
      onFulfilled: (state, action) => {
        state.favoriteFoodList = action.payload;
      },
    });
    
    // Add favorite food - using upsert pattern
    createAsyncThunkHandler(builder, addFavoriteFoodAPI, {
      loadingKey: 'isLoadingFavorite',
      onFulfilled: (state, action) => {
        const favId = action.payload.favoriteFoodId;
        state.favoriteFoodList = state.favoriteFoodList.filter(
          fav => fav.favoriteFoodId !== favId
        );
        state.favoriteFoodList.push(action.payload);
      },
    });
    
    // Delete favorite food
    createAsyncThunkHandler(builder, deleteFavoriteFoodAPI, {
      loadingKey: 'isLoadingFavorite',
      onFulfilled: (state, action) => {
        state.favoriteFoodList = state.favoriteFoodList.filter(
          favorite => favorite.favoriteFoodId !== action.payload.favoriteFoodId
        );
      },
    });
  },
});

export default favoriteSlice.reducer; 