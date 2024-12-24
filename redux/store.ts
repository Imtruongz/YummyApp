import {configureStore} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/query';

import foodSlice from './slices/food/foodSlice';
import categoriesSlice from './slices/category/categoriesSlice';
import recipesSlice from './slices/recipe/recipesSlice';
import accountSlice from './slices/account/accountSlice';

import {categoriesAPI} from './slices/category/categoriesService';
import {recipesAPI} from './slices/recipe/recipesService';
import {randomFoodAPI} from './slices/food/randomFoodService';

export const store = configureStore({
  reducer: {
    food: foodSlice,
    categories: categoriesSlice,
    recipes: recipesSlice,
    account: accountSlice,

    //RTK Query
    [categoriesAPI.reducerPath]: categoriesAPI.reducer,
    [randomFoodAPI.reducerPath]: randomFoodAPI.reducer,
    [recipesAPI.reducerPath]: recipesAPI.reducer,
  },
  //middleware
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(
      categoriesAPI.middleware,
      randomFoodAPI.middleware,
      recipesAPI.middleware,
    ),
});

setupListeners(store.dispatch);

//Get root state and app dispatch store
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export default store;
