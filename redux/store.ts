import {configureStore} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/query';

import foodSlice from './slices/food/foodSlice';

import categoriesSlice from './slices/category/categoriesSlice';
import {categoriesAPI} from './slices/category/categoriesService';

export const store = configureStore({
  reducer: {
    food: foodSlice,
    categories: categoriesSlice,
    [categoriesAPI.reducerPath]: categoriesAPI.reducer,
  },
  //middleware
  middleware: getDefaultMiddleware =>
  getDefaultMiddleware().concat(categoriesAPI.middleware),
});

setupListeners(store.dispatch);

//Get root state and app dispatch store
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export default store;
