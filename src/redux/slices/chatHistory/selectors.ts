import { RootState } from '../../store';

/**
 * Selectors for chatHistory slice
 */

export const selectChatHistoryState = (state: RootState) => state.chatHistory;

export const selectConversations = (state: RootState) => state.chatHistory.conversations;

export const selectCurrentConversation = (state: RootState) => state.chatHistory.currentConversation;

export const selectIsLoadingChat = (state: RootState) => state.chatHistory.isLoading;

export const selectIsLoadingConversations = (state: RootState) => state.chatHistory.isLoadingConversations;

export const selectChatError = (state: RootState) => state.chatHistory.error;

export const selectChatPage = (state: RootState) => state.chatHistory.page;

export const selectChatTotalCount = (state: RootState) => state.chatHistory.totalCount;

export const selectChatHasMore = (state: RootState) => state.chatHistory.hasMore;

export const selectCurrentConversationMessages = (state: RootState) =>
  state.chatHistory.currentConversation?.messages ?? [];

export const selectConversationById = (conversationId: string) => (state: RootState) =>
  state.chatHistory.conversations.find(conv => conv.conversationId === conversationId);
