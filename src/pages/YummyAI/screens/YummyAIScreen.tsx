import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, FlatList, Image, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStack } from '@/navigation/types';

import { aiApi } from '@/api/aiApi';
import { YummyDrag, ImagesSvg, colors, showToast, useModal, goBack } from '@/utils'
import { saveChatAPI, addMessageToConversationAPI } from '@/redux/slices/chatHistory/chatHistoryThunk';
import { AppDispatch } from '@/redux/store';

import { SaveChatModal, QuickActionButtons, TypingIndicator } from '@/pages/YummyAI/components'
import { IconSvg, HomeHeader, Typography, CustomInput, MenuOption } from '@/components';

type Message = {
  id: string;
  text?: string;
  isUser: boolean;
  isTyping?: boolean;
};

type YummyAIScreenProps = NativeStackScreenProps<HomeStack, 'YummyAIScreen'>;

const YummyAIScreen: React.FC<YummyAIScreenProps> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [messages, setMessages] = useState<Message[]>(() => {
    const preset = route?.params?.presetMessages;
    if (preset && Array.isArray(preset) && preset.length > 0) {
      return preset.map(m => ({ id: m.id, text: m.text, isUser: m.isUser }));
    }
    return [
      {
        id: 'welcome',
        text: t('Yummy_AI.ai_assistant_welcome'),
        isUser: false,
      },
    ];
  });

  const menuOptions: MenuOption[] = [
    {
      id: 'chat-history',
      label: t('chatHistory.title'),
      icon: '📋',
      onPress: () => {
        (navigation as any).push('ChatHistory');
      },
    },
  ];
  const [input, setInput] = useState('');
  const saveModal = useModal();
  const [savingChat, setSavingChat] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const continuingConversationId = route?.params?.conversationId;

  // ✅ FIXED: Helper function to scroll to bottom with delay
  const scrollToBottom = (delay: number = 100) => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, delay);
  };

  // ✅ FIXED: Listen to keyboard events for proper scroll behavior
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        // Scroll to bottom when keyboard appears
        scrollToBottom(150);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        // Scroll to bottom when keyboard hides
        scrollToBottom(150);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // ✅ FIXED: Scroll when messages change
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom(100);
    }
  }, [messages]);

  const handleGoBack = async () => {
    // Only auto-save when this is a brand-new chat (not continuing existing one)
    if (!continuingConversationId && messages.length >= 3) {
      try {
        const messagesToSave = messages
          .filter(msg => !msg.isTyping && msg.text)
          .map(msg => ({
            text: msg.text!,
            isUser: msg.isUser,
          }));

        await dispatch(
          saveChatAPI({
            messages: messagesToSave,
            title: '',
          })
        ).unwrap();

        console.log('Chat saved on goback');
      } catch (error: any) {
        console.log('Save error:', error);
      }
    }
    goBack();
  };

  const sendMessage = async (messageText: string, delay: number = 0) => {
    if (!messageText.trim()) return;

    const executeMessage = async () => {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: messageText.trim(),
        isUser: true,
      };

      const typingIndicatorId = `typing-${Date.now()}`;

      setMessages(prev => [...prev, userMessage]);
      setInput('');

      // If continuing an existing conversation, persist user's message to server
      if (continuingConversationId) {
        try {
          await dispatch(
            addMessageToConversationAPI({
              conversationId: continuingConversationId,
              message: { text: userMessage.text!, isUser: true },
            })
          ).unwrap();
        } catch (e) {
          console.log('Failed to add user message to conversation:', e);
        }
      }

      setMessages(prev => [...prev, {
        id: typingIndicatorId,
        isUser: false,
        isTyping: true,
      }]);

      try {
        const conversationHistory = messages
          .filter(msg => !msg.id.includes('typing') && msg.text)
          .map(msg => ({
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.text!,
          }));

        const response = await aiApi.askCookingQuestion(
          messageText.trim(),
          conversationHistory
        );
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.answer,
          isUser: false,
        };
        setMessages(prev =>
          prev.filter(msg => msg.id !== typingIndicatorId).concat(aiMessage)
        );

        // Persist AI's reply to existing conversation as well
        if (continuingConversationId && aiMessage.text) {
          try {
            await dispatch(
              addMessageToConversationAPI({
                conversationId: continuingConversationId,
                message: { text: aiMessage.text, isUser: false },
              })
            ).unwrap();
          } catch (e) {
            console.log('Failed to add AI message to conversation:', e);
          }
        }
      } catch (error: any) {
        setMessages(prev => prev.filter(msg => msg.id !== typingIndicatorId));
        showToast.error(t('Yummy_AI.ai_assistant_error'), error.message);
      }
    };

    if (delay > 0) {
      setTimeout(executeMessage, delay);
    } else {
      await executeMessage();
    }
  };

  const handleSend = async () => {
    await sendMessage(input);
  };

  const handleSaveChat = async (title: string) => {
    try {
      setSavingChat(true);
      const messagesToSave = messages
        .filter(msg => msg.id !== 'welcome' && !msg.isTyping && msg.text)
        .map(msg => ({
          text: msg.text!,
          isUser: msg.isUser,
        }));

      await dispatch(
        saveChatAPI({
          messages: messagesToSave,
          title: title,
        })
      ).unwrap();

      setSavingChat(false);

      showToast.success(t('chatHistory.saveSuccess'), title || t('chatHistory.autoTitle'));

      saveModal.close();
    } catch (error: any) {
      setSavingChat(false);
      showToast.error(t('common.error'), error?.message || t('chatHistory.saveError'));
    }
  };

  const handleQuickAction = (message: string) => {
    setInput(message);
    sendMessage(message, 100);
  };

  const quickActions = [
    {
      id: '1',
      label: t('Yummy_AI.ai_action_recipe'),
      icon: '🍳',
      action: () => handleQuickAction('Hãy gợi ý cho tôi một công thức nấu ăn ngon và dễ làm'),
    },
    {
      id: '2',
      label: t('Yummy_AI.ai_action_technique'),
      icon: '👨‍🍳',
      action: () => handleQuickAction('Hãy chia sẻ một kỹ thuật nấu ăn quan trọng'),
    },
    {
      id: '3',
      label: t('Yummy_AI.ai_action_nutrition'),
      icon: '🥗',
      action: () => handleQuickAction('Cho tôi biết về giá trị dinh dưỡng của các loại thực phẩm'),
    },
    {
      id: '4',
      label: t('Yummy_AI.ai_action_tips'),
      icon: '💡',
      action: () => handleQuickAction('Chia sẻ một mẹo nấu ăn hữu ích'),
    },
  ];

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.isUser ? styles.userMessage : styles.aiMessage
    ]}>
      {!item.isUser && (
        <View style={styles.aiAvatar}>
          <Image
            source={YummyDrag}
            style={{ width: 36, height: 36 }}
            resizeMode="contain"
          />
        </View>
      )}
      <View style={[
        styles.messageBubble,
        item.isUser ? styles.userBubble : styles.aiBubble
      ]}>
        {item.isTyping ? (
          <TypingIndicator />
        ) : (
          <Typography
            title={item.text || ''}
            fontSize={16}
            style={item.isUser ? styles.userText : styles.aiText}
          />
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <HomeHeader
          mode="back"
          title={t('Yummy_AI.ai_assistant_title')}
          showNotification={false}
          showGoBack={true}
          showMenuButton={true}
          menuOptions={menuOptions}
          onGoBack={handleGoBack}
        />
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          style={styles.messageList}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            messages.length === 1 ? (
              <QuickActionButtons actions={quickActions} />
            ) : null
          }
        />

        <View style={styles.inputContainer}>
          <CustomInput
            style={styles.input}
            placeholder={t('Yummy_AI.ai_assistant_placeholder')}
            value={input}
            onChangeText={setInput}
            multiline
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
            disabled={!input.trim()}>
            <IconSvg xml={ImagesSvg.icSend} width={36} height={36} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Save Chat Modal */}
      <SaveChatModal
        visible={saveModal.isVisible}
        isLoading={savingChat}
        onSave={handleSaveChat}
        onCancel={saveModal.close}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  messageList: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  aiMessage: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: colors.InputBg,
    borderBottomLeftRadius: 4,
  },
  userText: {
    color: colors.white,
  },
  aiText: {
    color: colors.dark,
  },
  aiAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderColor: colors.primary,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.gray,
    backgroundColor: colors.light,
  },
  input: {
    flex: 1,
    height: 52,
    backgroundColor: colors.InputBg,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    borderRadius: 26,
  },
  sendButton: {
    backgroundColor: colors.white,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default YummyAIScreen;