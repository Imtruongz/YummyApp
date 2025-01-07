import {configureStore} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/query';

import userSlice from './slices/auth/userSlice';
import authSlice from './slices/auth/authSlice';
import foodSlice from './slices/food/foodSlice';
import reviewSlice from './slices/review/reviewSlice';
import categoriesSlice from './slices/category/categoriesSlice';

export const store = configureStore({
  reducer: {
    food: foodSlice,
    auth: authSlice,
    user: userSlice,
    categories: categoriesSlice,
    review: reviewSlice,
  },
});

setupListeners(store.dispatch);

//Get root state and app dispatch store
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export default store;
