import {configureStore} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/query';

import userSlice from './slices/auth/userSlice';
import authSlice from './slices/auth/authSlice';
import foodSlice from './slices/food/foodSlice';
import categoriesSlice from './slices/category/categoriesSlice';

export const store = configureStore({
  reducer: {
    food: foodSlice,
    auth: authSlice,
    user: userSlice,
    categories: categoriesSlice,
  },
});

setupListeners(store.dispatch);

//Get root state and app dispatch store
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export default store;
