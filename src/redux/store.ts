import { configureStore, Middleware } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';



import foodSlice from './slices/food/foodSlice';
import authSlice from './slices/auth/authSlice';
import userSlice from './slices/auth/userSlice';
import signupSlice from './slices/auth/signupSlice';
import categoriesSlice from './slices/category/categoriesSlice';
import reviewSlice from './slices/review/reviewSlice';
import ratingSlice from './slices/rating/ratingSlice';
import favoriteSlice from './slices/favorite/favoriteSlice';
import followSlice from './slices/follow/followSlice';
import notificationSlice from './slices/notification/notificationSlice';
import chatHistorySlice from './slices/chatHistory/chatHistorySlice';

// ⭐ Middleware to handle reset store on logout
const resetStoreMiddleware: Middleware = store => next => action => {
  if (action.type === 'RESET_STORE') {
    // Reset to initial state
    store.dispatch({ type: 'food/@@INIT' });
    store.dispatch({ type: 'auth/@@INIT' });
    store.dispatch({ type: 'user/@@INIT' });
    store.dispatch({ type: 'signup/@@INIT' });
    store.dispatch({ type: 'categories/@@INIT' });
    store.dispatch({ type: 'review/@@INIT' });
    store.dispatch({ type: 'rating/@@INIT' });
    store.dispatch({ type: 'favorite/@@INIT' });
    store.dispatch({ type: 'follow/@@INIT' });
    store.dispatch({ type: 'notification/@@INIT' });
    store.dispatch({ type: 'chatHistory/@@INIT' });
    return;
  }
  return next(action);
};

export const store = configureStore({
  reducer: {
    food: foodSlice,
    auth: authSlice,
    user: userSlice,
    signup: signupSlice,
    categories: categoriesSlice,
    review: reviewSlice,
    rating: ratingSlice,
    favorite: favoriteSlice,
    follow: followSlice,
    notification: notificationSlice,
    chatHistory: chatHistorySlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(resetStoreMiddleware),
});

setupListeners(store.dispatch);

//Get root state and app dispatch store
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export default store;
