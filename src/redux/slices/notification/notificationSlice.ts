import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification, NotificationState } from './types';
import { fetchNotifications } from './notificationThunk';

const initialState: NotificationState = {
  list: [],
  isLoading: false,
  isError: false,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotifications(state, action: PayloadAction<Notification[]>) {
      state.list = action.payload;
      state.isLoading = false;
      state.isError = false;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<boolean>) {
      state.isError = action.payload;
    },
    markAsRead(state, action: PayloadAction<string>) {
      const idx = state.list.findIndex(n => n._id === action.payload);
      if (idx !== -1) state.list[idx].isRead = true;
    },
    clearNotifications(state) {
      state.list = [];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchNotifications.pending, state => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchNotifications.fulfilled, (state, action: PayloadAction<Notification[]>) => {
        state.list = action.payload;
        state.isLoading = false;
        state.isError = false;
      })
      .addCase(fetchNotifications.rejected, state => {
        state.isLoading = false;
        state.isError = true;
      });
  }
});

export const { setNotifications, setLoading, setError, markAsRead, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
