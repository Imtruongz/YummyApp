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
    // Clear current conversation
    clearCurrentConversation: (state) => {
      state.currentConversation = null;
    },
    // Reset error
    resetError: (state) => {
      state.isError = false;
      state.error = null;
    },
    // Reset conversations list
    resetConversations: (state) => {
      state.conversations = [];
      state.page = 1;
      state.totalCount = 0;
      state.hasMore = false;
    },
  },
  extraReducers: (builder) => {
    // Save chat
    builder.addCase(saveChatAPI.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.error = null;
    });
    builder.addCase(saveChatAPI.fulfilled, (state) => {
      state.isLoading = false;
      state.isError = false;
    });
    builder.addCase(saveChatAPI.rejected, (state, action: any) => {
      state.isLoading = false;
      state.isError = true;
      state.error = action.payload?.message || 'Error saving chat';
    });

    // Add message
    builder.addCase(addMessageToConversationAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      addMessageToConversationAPI.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        if (state.currentConversation) {
          state.currentConversation.messages = action.payload.messages;
          state.currentConversation.updatedAt = new Date().toISOString();
        }
      }
    );
    builder.addCase(addMessageToConversationAPI.rejected, (state, action: any) => {
      state.isLoading = false;
      state.isError = true;
      state.error = action.payload?.message || 'Error adding message';
    });

    // Get conversations list
    builder.addCase(getUserConversationsAPI.pending, (state) => {
      state.isLoadingConversations = true;
      state.isError = false;
    });
    builder.addCase(
      getUserConversationsAPI.fulfilled,
      (
        state,
        action: PayloadAction<{
          conversations: ConversationListItem[];
          totalCount: number;
          hasMore: boolean;
          currentPage: number;
        }>
      ) => {
        state.isLoadingConversations = false;
        state.conversations = action.payload.conversations;
        state.totalCount = action.payload.totalCount;
        state.hasMore = action.payload.hasMore;
        state.page = action.payload.currentPage;
      }
    );
    builder.addCase(getUserConversationsAPI.rejected, (state, action: any) => {
      state.isLoadingConversations = false;
      state.isError = true;
      state.error = action.payload?.message || 'Error loading conversations';
    });

    // Get conversation detail
    builder.addCase(getConversationDetailAPI.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
    });
    builder.addCase(
      getConversationDetailAPI.fulfilled,
      (state, action: PayloadAction<Conversation>) => {
        state.isLoading = false;
        state.currentConversation = action.payload;
      }
    );
    builder.addCase(getConversationDetailAPI.rejected, (state, action: any) => {
      state.isLoading = false;
      state.isError = true;
      state.error = action.payload?.message || 'Error loading conversation';
    });

    // Delete conversation
    builder.addCase(deleteConversationAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      deleteConversationAPI.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.conversations = state.conversations.filter(
          (conv) => conv.conversationId !== action.payload
        );
        if (
          state.currentConversation?.conversationId === action.payload
        ) {
          state.currentConversation = null;
        }
      }
    );
    builder.addCase(deleteConversationAPI.rejected, (state, action: any) => {
      state.isLoading = false;
      state.isError = true;
      state.error = action.payload?.message || 'Error deleting conversation';
    });

    // Update title
    builder.addCase(updateConversationTitleAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      updateConversationTitleAPI.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        const updatedConv = state.conversations.find(
          (conv) => conv.conversationId === action.payload.conversationId
        );
        if (updatedConv) {
          updatedConv.title = action.payload.title;
        }
        if (state.currentConversation) {
          state.currentConversation.title = action.payload.title;
        }
      }
    );
    builder.addCase(updateConversationTitleAPI.rejected, (state, action: any) => {
      state.isLoading = false;
      state.isError = true;
      state.error = action.payload?.message || 'Error updating title';
    });

    // Export conversation
    builder.addCase(exportConversationAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(exportConversationAPI.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(exportConversationAPI.rejected, (state, action: any) => {
      state.isLoading = false;
      state.isError = true;
      state.error = action.payload?.message || 'Error exporting conversation';
    });
  },
});

export const {
  clearCurrentConversation,
  resetError,
  resetConversations,
} = chatHistorySlice.actions;

export default chatHistorySlice.reducer;
