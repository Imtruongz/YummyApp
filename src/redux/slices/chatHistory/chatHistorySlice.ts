import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ChatHistoryState,
  Conversation,
  ConversationListItem,
} from './types';
import {
  saveChatAPI,
  addMessageToConversationAPI,
  getUserConversationsAPI,
  getConversationDetailAPI,
  deleteConversationAPI,
  updateConversationTitleAPI,
  exportConversationAPI,
} from './chatHistoryThunk';
import { createAsyncThunkHandler } from '../../utils/asyncThunkHandler';

const initialState: ChatHistoryState = {
  conversations: [],
  currentConversation: null,
  isLoading: false,
  isLoadingConversations: false,
  isError: false,
  error: null,
  page: 1,
  totalCount: 0,
  hasMore: false,
};

const chatHistorySlice = createSlice({
  name: 'chatHistory',
  initialState,
  reducers: {
    clearCurrentConversation: (state) => {
      state.currentConversation = null;
    },
    resetError: (state) => {
      state.isError = false;
      state.error = null;
    },
    resetConversations: (state) => {
      state.conversations = [];
      state.page = 1;
      state.totalCount = 0;
      state.hasMore = false;
    },
  },
  extraReducers: (builder) => {
    // Save chat
    createAsyncThunkHandler(builder, saveChatAPI, {
      loadingKey: 'isLoading',
    });

    // Add message
    createAsyncThunkHandler(builder, addMessageToConversationAPI, {
      loadingKey: 'isLoading',
      onFulfilled: (state, action: PayloadAction<any>) => {
        if (state.currentConversation) {
          state.currentConversation.messages = action.payload.messages;
          state.currentConversation.updatedAt = new Date().toISOString();
        }
      },
    });

    // Get conversations list
    createAsyncThunkHandler(builder, getUserConversationsAPI, {
      loadingKey: 'isLoadingConversations',
      onFulfilled: (
        state,
        action: PayloadAction<{
          conversations: ConversationListItem[];
          totalCount: number;
          hasMore: boolean;
          currentPage: number;
        }>
      ) => {
        state.conversations = action.payload.conversations;
        state.totalCount = action.payload.totalCount;
        state.hasMore = action.payload.hasMore;
        state.page = action.payload.currentPage;
      },
    });

    // Get conversation detail
    createAsyncThunkHandler(builder, getConversationDetailAPI, {
      loadingKey: 'isLoading',
      onFulfilled: (state, action: PayloadAction<Conversation>) => {
        state.currentConversation = action.payload;
      },
    });

    // Delete conversation
    createAsyncThunkHandler(builder, deleteConversationAPI, {
      loadingKey: 'isLoading',
      onFulfilled: (state, action: PayloadAction<string>) => {
        state.conversations = state.conversations.filter(
          (conv) => conv.conversationId !== action.payload
        );
        if (state.currentConversation?.conversationId === action.payload) {
          state.currentConversation = null;
        }
      },
    });

    // Update conversation title
    createAsyncThunkHandler(builder, updateConversationTitleAPI, {
      loadingKey: 'isLoading',
      onFulfilled: (state, action: PayloadAction<any>) => {
        const updatedConv = state.conversations.find(
          (conv) => conv.conversationId === action.payload.conversationId
        );
        if (updatedConv) {
          updatedConv.title = action.payload.title;
        }
        if (state.currentConversation) {
          state.currentConversation.title = action.payload.title;
        }
      },
    });

    // Export conversation
    createAsyncThunkHandler(builder, exportConversationAPI, {
      loadingKey: 'isLoading',
    });
  },
});

export const {
  clearCurrentConversation,
  resetError,
  resetConversations,
} = chatHistorySlice.actions;

export default chatHistorySlice.reducer;
