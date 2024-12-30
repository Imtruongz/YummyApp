import {configureStore} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/query';

import categoriesSlice from './slices/category/categoriesSlice';
import {categoriesAPI} from './slices/category/categoriesService';

import authSlice from './slices/auth/authSlice';
import foodSlice from './slices/food/foodSlice';

export const store = configureStore({
  reducer: {
    food: foodSlice,
    categories: categoriesSlice,
    auth: authSlice,
    [categoriesAPI.reducerPath]: categoriesAPI.reducer,
  },
});

setupListeners(store.dispatch);

//Get root state and app dispatch store
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export default store;
