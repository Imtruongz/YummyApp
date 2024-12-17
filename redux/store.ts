import {configureStore} from '@reduxjs/toolkit';

//import { rootReducer } from "./reducer";

import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

//Get root state and app dispatch store
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export default store;
