import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ImagesSvg, colors, handleAsyncAction, showToast } from '@/utils'
import { AppDispatch } from '@/redux/store';
import { resetConversations} from '@/redux/slices/chatHistory/chatHistorySlice';
import ChatHistoryItem from '@/pages/YummyAI/components/ChatHistoryItem';
import { getUserConversationsAPI, deleteConversationAPI} from '@/redux/slices/chatHistory/chatHistoryThunk';
import { IconSvg, HomeHeader, CustomLoadingSpinner } from '@/components'
import {
  selectConversations,
  selectIsLoadingConversations,
  selectChatPage,
  selectChatHasMore,
  selectChatTotalCount,
} from '@/redux/selectors';

interface ChatHistoryScreenProps {
  navigation: any;
}

const ChatHistoryScreen: React.FC<ChatHistoryScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const conversations = useSelector(selectConversations);
  const isLoadingConversations = useSelector(selectIsLoadingConversations);
  const page = useSelector(selectChatPage);
  const hasMore = useSelector(selectChatHasMore);
  const totalCount = useSelector(selectChatTotalCount);

  const [searchText, setSearchText] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchText.toLowerCase())
  );

  // Load conversations on mount
  useEffect(() => {
    dispatch(resetConversations());
    loadConversations(1);
  }, []);

  const loadConversations = (pageNum: number) => {
    dispatch(
      getUserConversationsAPI({
        page: pageNum,
        limit: 20,
      })
    );
  };

  const handleLoadMore = () => {
    if (hasMore && !isLoadingConversations) {
      loadConversations(page + 1);
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    navigation.navigate('ChatDetail', { conversationId });
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleDeleteConversation = async (conversationId: string) => {
    setDeletingId(conversationId);
    await handleAsyncAction(
      () => dispatch(deleteConversationAPI(conversationId)).unwrap(),
      {
        onSuccess: () => setDeletingId(null),
        onError: (error: any) => {
          setDeletingId(null);
          showToast.error(t('common.error'), error?.message || t('chatHistory.deleteError'));
        },
        successMessage: t('chatHistory.deleteSuccess'),
        errorMessage: t('chatHistory.deleteError'),
        showSuccessToast: false
      }
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      {/* <Ionicons name="chatbubbles-outline" size={64} color="#ddd" /> */}
      <Text style={styles.emptyTitle}>
        {t('chatHistory.noChats')}
      </Text>
      <Text style={styles.emptySubtitle}>
        {t('chatHistory.noChatMessage')}
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!isLoadingConversations) return null;
    return (
      <View style={styles.footerLoader}>
        <CustomLoadingSpinner size={30} color="#FF6B6B" />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <HomeHeader
        mode="back"
        title={t('chatHistory.title')}
        showNotification={false}
        showGoBack={true}
        onGoBack={handleGoBack}
      />
      <View style={styles.header}>
        <Text style={styles.chatCount}>
          {totalCount} {t('chatHistory.chats')}
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <IconSvg xml={ImagesSvg.icSearch} width={18} height={18} color={colors.dark} />
        
        <TextInput
          style={styles.searchInput}
          placeholder={t('chatHistory.searchPlaceholder')}
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#999"
        />
        {searchText !== '' && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <IconSvg xml={ImagesSvg.icClose} width={18} height={18}/>
          </TouchableOpacity>
        )}
      </View>

      {filteredConversations.length === 0 && searchText === '' ? (
        renderEmptyState()
      ) : filteredConversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>
            {t('chatHistory.noResults')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredConversations}
          keyExtractor={(item) => item.conversationId}
          renderItem={({ item }) => (
            <ChatHistoryItem
              conversationId={item.conversationId}
              title={item.title}
              createdAt={item.createdAt}
              onPress={() => handleSelectConversation(item.conversationId)}
              onDelete={() =>
                handleDeleteConversation(item.conversationId)
              }
              isDeleting={deletingId === item.conversationId}
            />
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          scrollEnabled={true}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.light,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  chatCount: {
    fontSize: 13,
    color: '#999',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 8,
    fontSize: 14,
    color: '#333',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});

export default ChatHistoryScreen;
