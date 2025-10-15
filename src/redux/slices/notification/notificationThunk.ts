import { createAsyncThunk } from '@reduxjs/toolkit';
import { Notification } from './types';
import api from '../../../api/config';

export const fetchNotifications = createAsyncThunk(
	'notification/fetchNotifications',
	async (userId: string, thunkAPI) => {
		try {
			const response = await api.get<Notification[]>(`/notifications/${userId}`, {
				signal: thunkAPI.signal,
			});
			if (!response.data || response.data.length === 0) {
				console.log('No notifications returned from the server');
				return thunkAPI.rejectWithValue('No notifications returned from the server');
			}
			return response.data;
		} catch (error: any) {
			console.log('Error fetching notifications:', error.message, error.response?.data);
			return thunkAPI.rejectWithValue(error.response?.data || 'Unexpected error occurred');
		}
	}
);
