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
    loadingKey?: keyof State; // Specify which state to set loading
  }
) => {
  const loadingKey = handlers?.loadingKey || 'isLoading';

  builder
    // Handle pending
    .addCase(asyncThunk.pending, (state: any) => {
      state[loadingKey] = true;
      state.error = null;
    })
    // Handle fulfilled
    .addCase(asyncThunk.fulfilled, (state: any, action: any) => {
      state[loadingKey] = false;
      state.error = null;
      
      // Call custom fulfilled handler if provided
      if (handlers?.onFulfilled) {
        handlers.onFulfilled(state, action);
      }
    })
    // Handle rejected
    .addCase(asyncThunk.rejected, (state: any, action: any) => {
      state[loadingKey] = false;
      
      // Set error message from payload or use default
      state.error = action.payload?.message || 
                    action.payload?.error || 
                    'An error occurred';
      
      // Call custom rejected handler if provided
      if (handlers?.onRejected) {
        handlers.onRejected(state, action);
      }
    });
};
