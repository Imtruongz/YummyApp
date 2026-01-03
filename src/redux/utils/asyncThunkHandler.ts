import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

/**
 * Helper function để xử lý pending/fulfilled/rejected states
 * Giảm duplicate code khi xử lý async thunks
 * 
 * @param builder - Redux builder từ extraReducers
 * @param asyncThunk - Async thunk action
 * @param handlers - Custom handlers cho fulfilled và rejected cases
 * 
 * @example
 * createAsyncThunkHandler(builder, getAllFoodAPI, {
 *   onFulfilled: (state, action) => {
 *     state.foodList = action.payload;
 *   }
 * });
 */
export const createAsyncThunkHandler = <State, PayloadType>(
  builder: ActionReducerMapBuilder<State>,
  asyncThunk: any,
  handlers?: {
    onFulfilled?: (state: State, action: any) => void;
    onRejected?: (state: State, action: any) => void;
    loadingKey?: keyof State; // Specify which state to set loading (boolean)
    errorKey?: keyof State;   // Specify which state to set error flag (boolean)
    errorMessageKey?: keyof State; // Specify where to store error message (string|null)
  }
) => {
  const loadingKey = handlers?.loadingKey || ('isLoading' as keyof State);
  const errorKey = handlers?.errorKey as keyof State | undefined;
  const errorMessageKey = handlers?.errorMessageKey as keyof State | undefined;

  builder
    // Handle pending
    .addCase(asyncThunk.pending, (state: any) => {
      if (loadingKey) state[loadingKey] = true;
      if (errorKey) state[errorKey] = false;
      if (errorMessageKey) state[errorMessageKey] = null;
      // Backward compatible default error field
      state.error = null;
    })
    // Handle fulfilled
    .addCase(asyncThunk.fulfilled, (state: any, action: any) => {
      if (loadingKey) state[loadingKey] = false;
      if (errorKey) state[errorKey] = false;
      if (errorMessageKey) state[errorMessageKey] = null;
      state.error = null;
      
      // Call custom fulfilled handler if provided
      if (handlers?.onFulfilled) {
        handlers.onFulfilled(state, action);
      }
    })
    // Handle rejected
    .addCase(asyncThunk.rejected, (state: any, action: any) => {
      if (loadingKey) state[loadingKey] = false;

      const message = action.payload?.message || action.payload?.error || action.error?.message || 'An error occurred';
      if (errorKey) state[errorKey] = true;
      if (errorMessageKey) state[errorMessageKey] = message;
      // Backward compatible default error field
      state.error = message;

      // Call custom rejected handler if provided
      if (handlers?.onRejected) {
        handlers.onRejected(state, action);
      }
    });
};
