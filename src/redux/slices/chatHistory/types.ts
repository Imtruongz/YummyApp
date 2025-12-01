export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

export interface Conversation {
  conversationId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface ConversationListItem {
  conversationId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatHistoryState {
  conversations: ConversationListItem[];
  currentConversation: Conversation | null;
  isLoading: boolean;
  isLoadingConversations: boolean;
  isError: boolean;
  error: string | null;
  page: number;
  totalCount: number;
  hasMore: boolean;
}
