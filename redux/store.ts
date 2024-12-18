import {configureStore} from '@reduxjs/toolkit';

import foodSlice from './slices/foodSlice';

export const store = configureStore({
  reducer: {
    food: foodSlice,
  },
});

//Get root state and app dispatch store
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export default store;
