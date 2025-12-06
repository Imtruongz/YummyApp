import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';



import foodSlice from './slices/food/foodSlice';
import authSlice from './slices/auth/authSlice';
import userSlice from './slices/auth/userSlice';
import categoriesSlice from './slices/category/categoriesSlice';
import reviewSlice from './slices/review/reviewSlice';
import ratingSlice from './slices/rating/ratingSlice';
import favoriteSlice from './slices/favorite/favoriteSlice';
import followSlice from './slices/follow/followSlice';
import notificationSlice from './slices/notification/notificationSlice';
import chatHistorySlice from './slices/chatHistory/chatHistorySlice';

export const store = configureStore({
  reducer: {
    food: foodSlice,
    auth: authSlice,
    user: userSlice,
    categories: categoriesSlice,
    review: reviewSlice,
    rating: ratingSlice,
    favorite: favoriteSlice,
    follow: followSlice,
    notification: notificationSlice,
    chatHistory: chatHistorySlice,
  },
});

setupListeners(store.dispatch);

//Get root state and app dispatch store
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export default store;
