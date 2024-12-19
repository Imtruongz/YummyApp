import {configureStore} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/query';

import foodSlice from './slices/food/foodSlice';

import categoriesSlice from './slices/category/categoriesSlice';
import {categoriesAPI} from './slices/category/categoriesService';
import { randomFoodAPI } from './slices/food/randomFoodService';

export const store = configureStore({
  reducer: {
    food: foodSlice,
    categories: categoriesSlice,

    //RTK Query
    [categoriesAPI.reducerPath]: categoriesAPI.reducer,
    [randomFoodAPI.reducerPath]: randomFoodAPI.reducer,
  },
  //middleware
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(categoriesAPI.middleware, randomFoodAPI.middleware),
});

setupListeners(store.dispatch);

//Get root state and app dispatch store
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export default store;
