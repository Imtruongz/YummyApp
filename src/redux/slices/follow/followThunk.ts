import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../api/config';

export const followUserAPI = createAsyncThunk(
  'follow/followUserAPI',
  async ({ followerId, followingId }: { followerId: string, followingId: string }, { rejectWithValue }) => {
    try {
      const res = await api.post('/follow', { followerId, followingId });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const unfollowUserAPI = createAsyncThunk(
  'follow/unfollowUserAPI',
  async ({ followerId, followingId }: { followerId: string, followingId: string }, { rejectWithValue }) => {
    try {
      const res = await api.delete('/follow', { data: { followerId, followingId } });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const isFollowingAPI = createAsyncThunk(
  'follow/isFollowingAPI',
  async ({ followerId, followingId }: { followerId: string, followingId: string }, { rejectWithValue }) => {
    try {
      const res = await api.get('/follow/status', { params: { followerId, followingId } });
      return res.data.isFollow;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getFollowersAPI = createAsyncThunk(
  'follow/getFollowersAPI',
  async (userId: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/follow/followers/${userId}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getFollowingAPI = createAsyncThunk(
  'follow/getFollowingAPI',
  async (userId: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/follow/following/${userId}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const countFollowersAPI = createAsyncThunk(
  'follow/countFollowersAPI',
  async (userId: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/follow/followers/${userId}/count`);
      return res.data.count;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const countFollowingAPI = createAsyncThunk(
  'follow/countFollowingAPI',
  async (userId: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/follow/following/${userId}/count`);
      return res.data.count;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
