import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../api/config';
import {
  ChatMessage,
  Conversation,
  ConversationListItem,
} from './types';

// Save new conversation
export const saveChatAPI = createAsyncThunk(
  'chatHistory/saveChatAPI',
  async (
    payload: {
      messages: {
        text: string;
        isUser: boolean;
      }[];
      title?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post('/ai/conversations/save', {
        messages: payload.messages,
        title: payload.title,
      });
      return response.data.data;
    } catch (error: any) {
      console.log('Error saving chat:', error.message);
      return rejectWithValue(error.response?.data);
    }
  }
);

// Add message to conversation
export const addMessageToConversationAPI = createAsyncThunk(
  'chatHistory/addMessageToConversationAPI',
  async (
    payload: {
      conversationId: string;
      message: {
        text: string;
        isUser: boolean;
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(
        `/ai/conversations/${payload.conversationId}/message`,
        { message: payload.message }
      );
      return response.data.data;
    } catch (error: any) {
      console.log('Error adding message:', error.message);
      return rejectWithValue(error.response?.data);
    }
  }
);

// Get user conversations list
export const getUserConversationsAPI = createAsyncThunk(
  'chatHistory/getUserConversationsAPI',
  async (
    payload: { page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get('/ai/conversations', {
        params: {
          page: payload.page || 1,
          limit: payload.limit || 20,
        },
      });
      return response.data.data;
    } catch (error: any) {
      console.log('Error getting conversations:', error.message);
      return rejectWithValue(error.response?.data);
    }
  }
);

// Get conversation detail
export const getConversationDetailAPI = createAsyncThunk(
  'chatHistory/getConversationDetailAPI',
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/ai/conversations/${conversationId}`
      );
      return response.data.data;
    } catch (error: any) {
      console.log('Error getting conversation detail:', error.message);
      return rejectWithValue(error.response?.data);
    }
  }
);

// Delete conversation
export const deleteConversationAPI = createAsyncThunk(
  'chatHistory/deleteConversationAPI',
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        `/ai/conversations/${conversationId}`
      );
      return conversationId;
    } catch (error: any) {
      console.log('Error deleting conversation:', error.message);
      return rejectWithValue(error.response?.data);
    }
  }
);

// Update conversation title
export const updateConversationTitleAPI = createAsyncThunk(
  'chatHistory/updateConversationTitleAPI',
  async (
    payload: {
      conversationId: string;
      title: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(
        `/ai/conversations/${payload.conversationId}/title`,
        { title: payload.title }
      );
      return response.data.data;
    } catch (error: any) {
      console.log('Error updating title:', error.message);
      return rejectWithValue(error.response?.data);
    }
  }
);

// Export conversation
export const exportConversationAPI = createAsyncThunk(
  'chatHistory/exportConversationAPI',
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/ai/conversations/${conversationId}/export`
      );
      return response.data.data;
    } catch (error: any) {
      console.log('Error exporting conversation:', error.message);
      return rejectWithValue(error.response?.data);
    }
  }
);
