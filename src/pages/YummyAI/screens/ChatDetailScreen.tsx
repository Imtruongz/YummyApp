import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { AppDispatch } from '@/redux/store';
import { getConversationDetailAPI, updateConversationTitleAPI,} from '@/redux/slices/chatHistory/chatHistoryThunk';
import { ImagesSvg, colors, goBack, handleAsyncAction, showToast } from '@/utils'
import { IconSvg, CustomLoadingSpinner } from '@/components'
import {
  selectCurrentConversation,
  selectIsLoadingChat,
} from '@/redux/selectors';

interface ChatDetailScreenProps {
  navigation: any;
  route: any;
}

const ChatDetailScreen: React.FC<ChatDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { t } = useTranslation();
  const { conversationId } = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const currentConversation = useSelector(selectCurrentConversation);
  const isLoading = useSelector(selectIsLoadingChat);

  const flatListRef = useRef<FlatList>(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Load conversation on mount
  useEffect(() => {
    loadConversationDetail();
  }, [conversationId]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (currentConversation && currentConversation.messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [currentConversation?.messages]);

  const loadConversationDetail = () => {
    dispatch(getConversationDetailAPI(conversationId));
  };

  const handleEditTitle = () => {
    setEditingTitle(true);
    setNewTitle(currentConversation?.title || '');
  };

  const handleSaveTitle = async () => {
    if (newTitle.trim() === currentConversation?.title) {
      setEditingTitle(false);
      return;
    }

    setIsSaving(true);
    await handleAsyncAction(
      () => dispatch(
        updateConversationTitleAPI({
          conversationId,
          title: newTitle.trim(),
        })
      ).unwrap(),
      {
        onSuccess: () => {
          setEditingTitle(false);
          setIsSaving(false);
        },
        onError: (error: any) => {
          setIsSaving(false);
          showToast.error(t('common.error'), error?.message || t('chatHistory.updateTitleError'));
        },
        successMessage: t('chatHistory.updateTitleSuccess'),
        errorMessage: t('chatHistory.updateTitleError'),
        showSuccessToast: false
      }
    );
  };

  const handleCancel = () => {
    setEditingTitle(false);
    setNewTitle('');
  };

  const renderMessage = ({
    item,
  }: {
    item: {
      id: string;
      text: string;
      isUser: boolean;
      timestamp: string;
    };
  }) => {
    const isUser = item.isUser;

    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.aiMessageContainer,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.aiBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isUser ? styles.userText : styles.aiText,
            ]}
          >
            {item.text}
          </Text>
        </View>
        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    );
  };

  if (isLoading && !currentConversation) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
        <View style={styles.loadingContainer}>
          <CustomLoadingSpinner size={40} color="#FF6B6B" />
        </View>
      </SafeAreaView>
    );
  }

  if (!currentConversation) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
        <View style={styles.errorContainer}>
          <IconSvg xml={ImagesSvg.icWarning} width={48} height={48} color={colors.dark} />
          <Text style={styles.errorText}>
            {t('chatHistory.loadError')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => goBack()}
            style={styles.backButton}
          >
            <IconSvg xml={ImagesSvg.icArrowLeft} width={24} height={24} color={colors.dark} />
          </TouchableOpacity>

          {editingTitle ? (
            <View style={styles.editTitleContainer}>
              <TextInput
                style={styles.titleInput}
                value={newTitle}
                onChangeText={setNewTitle}
                maxLength={255}
                editable={!isSaving}
              />
              <TouchableOpacity
                onPress={handleSaveTitle}
                disabled={isSaving}
                style={styles.saveTitleButton}
              >
                {isSaving ? (
                  <CustomLoadingSpinner size={16} color="#FF6B6B" />
                ) : (
                  <IconSvg xml={ImagesSvg.icSuccess} width={26} height={26} color={colors.dark} />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCancel}
                disabled={isSaving}
              >
                <IconSvg xml={ImagesSvg.icClose} width={28} height={28}/>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.titleContainer}>
              <Text style={styles.title} numberOfLines={2}>
                {currentConversation.title}
              </Text>
              <TouchableOpacity
                onPress={handleEditTitle}
                style={styles.editButton}
              >
                <IconSvg xml={ImagesSvg.icEdit} width={28} height={28} color={colors.dark} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={currentConversation.messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          scrollEnabled={true}
          ListEmptyComponent={
            <View style={styles.emptyMessagesContainer}>
              <Text style={styles.emptyText}>
                {t('chatHistory.noMessages')}
              </Text>
            </View>
          }
        />

        {/* Info Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {t('chatHistory.createdAt')}
            {new Date(currentConversation.createdAt).toLocaleDateString()}
          </Text>
          <Text style={styles.footerText}>
            {currentConversation.messages.length} {t('chatHistory.messages')}
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 12,
    paddingTop: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  editButton: {
    padding: 8,
  },
  editTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    paddingHorizontal: 8,
    gap: 8,
  },
  titleInput: {
    flex: 1,
    paddingVertical: 6,
    fontSize: 14,
    color: '#333',
  },
  saveTitleButton: {
    padding: 6,
  },
  headerRight: {
    width: 40,
  },
  messagesList: {
    flexGrow: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  messageContainer: {
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  aiMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  userBubble: {
    backgroundColor: '#FF6B6B',
  },
  aiBubble: {
    backgroundColor: '#f0f0f0',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: colors.light,
  },
  aiText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
    marginHorizontal: 6,
  },
  emptyMessagesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
  footer: {
    backgroundColor: colors.light,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    marginVertical: 2,
  },
});

export default ChatDetailScreen;
