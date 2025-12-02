import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Text,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { aiApi } from '../../../api/aiApi';
import colors from '../../../utils/color';
import { YummyDrag } from '../../../utils/assets';
import { ImagesSvg } from '../../../utils/ImageSvg';
import { RootStackParamList } from '../../../../android/types/StackNavType';
import { saveChatAPI } from '../../../redux/slices/chatHistory/chatHistoryThunk';
import { AppDispatch } from '../../../redux/store';

import Typography from '../../../components/customize/Typography';
import SaveChatModal from '../components/SaveChatModal';
import HomeHeader from '../../../components/HomeHeader';
import IconSvg from '../../../components/IconSvg';
import CustomInput from '../../../components/customize/CustomInput';
import QuickActionButtons from '../components/QuickActionButtons';

type Message = {
  id: string;
  text: string;
  isUser: boolean;
};

type YummyAIScreenProps = NativeStackScreenProps<RootStackParamList, 'YummyAIScreen'>;

const YummyAIScreen: React.FC<YummyAIScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: t('ai_assistant_welcome'),
      isUser: false,
    }
  ]);

  const handleMenuPress = () => {
    (navigation as any).push('ChatHistory');
  };
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [savingChat, setSavingChat] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      isUser: true,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await aiApi.askCookingQuestion(userMessage.text);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.answer,
        isUser: false,
      };
      setMessages(prev => [...prev, aiMessage]);
      
      // Auto-save chat if there are more than 2 messages (welcome + at least 1 exchange)
      setTimeout(() => {
        if (messages.length >= 3) {
          autoSaveChat([...messages, userMessage, aiMessage]);
        }
      }, 500);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: t('ai_assistant_error'),
        text2: error.message || t('ai_assistant_error_response'),
      });
    } finally {
      setLoading(false);
    }
  };

  const autoSaveChat = async (chatMessages: Message[]) => {
    try {
      const messagesToSave = chatMessages
        .filter(msg => msg.id !== '1') // Filter out welcome message
        .map(msg => ({
          text: msg.text,
          isUser: msg.isUser,
        }));

      if (messagesToSave.length === 0) return;

      setSavingChat(true);
      await dispatch(
        saveChatAPI({
          messages: messagesToSave,
          title: '', // Let backend auto-generate title from first user message
        })
      ).unwrap();
      setSavingChat(false);
      
      // Silent auto-save - don't show toast to avoid interruption
    } catch (error: any) {
      setSavingChat(false);
      console.log('Auto-save error:', error);
      // Silent fail - don't interrupt user experience
    }
  };

  const handleSaveChat = async (title: string) => {
    try {
      setSavingChat(true);
      const messagesToSave = messages
        .filter(msg => msg.id !== '1') // Filter out welcome message
        .map(msg => ({
          text: msg.text,
          isUser: msg.isUser,
        }));

      await dispatch(
        saveChatAPI({
          messages: messagesToSave,
          title: title,
        })
      ).unwrap();

      setSavingChat(false);
      setShowSaveModal(false);

      Toast.show({
        type: 'success',
        text1: t('chatHistory.saveSuccess') || 'Chat saved',
        text2: title || t('chatHistory.autoTitle') || 'Conversation saved successfully',
      });
    } catch (error: any) {
      setSavingChat(false);
      Toast.show({
        type: 'error',
        text1: t('common.error') || 'Error',
        text2: error?.message || t('chatHistory.saveError') || 'Failed to save chat',
      });
    }
  };

  const handleQuickAction = (message: string) => {
    setInput(message);
    setTimeout(() => {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: message,
        isUser: true,
      };

      setMessages(prev => [...prev, userMessage]);
      setInput('');
      setLoading(true);

      (async () => {
        try {
          const response = await aiApi.askCookingQuestion(message);
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: response.answer,
            isUser: false,
          };
          setMessages(prev => [...prev, aiMessage]);
        } catch (error: any) {
          Toast.show({
            type: 'error',
            text1: t('ai_assistant_error'),
            text2: error.message || t('ai_assistant_error_response'),
          });
        } finally {
          setLoading(false);
        }
      })();
    }, 100);
  };

  const quickActions = [
    {
      id: '1',
      label: t('ai_action_recipe') || 'Gợi ý công thức',
      icon: '🍳',
      action: () => handleQuickAction('Hãy gợi ý cho tôi một công thức nấu ăn ngon và dễ làm'),
    },
    {
      id: '2',
      label: t('ai_action_technique') || 'Kỹ thuật nấu ăn',
      icon: '👨‍🍳',
      action: () => handleQuickAction('Hãy chia sẻ một kỹ thuật nấu ăn quan trọng'),
    },
    {
      id: '3',
      label: t('ai_action_nutrition') || 'Dinh dưỡng',
      icon: '🥗',
      action: () => handleQuickAction('Cho tôi biết về giá trị dinh dưỡng của các loại thực phẩm'),
    },
    {
      id: '4',
      label: t('ai_action_tips') || 'Mẹo nấu ăn',
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
        <Typography
          title={item.text}
          fontSize={16}
          style={item.isUser ? styles.userText : styles.aiText}
        />
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
        <View style={styles.headerWithButtons}>
          <HomeHeader
            mode="back"
            title={t('ai_assistant_title')}
            showNotification={false}
            showGoBack={true}
            showMenuButton={true}
            onMenuPress={handleMenuPress}
          />
          {messages.length > 1 && (
            <TouchableOpacity
              style={styles.saveHeaderButton}
              onPress={() => setShowSaveModal(true)}
              disabled={loading || savingChat}
            >
              <Text style={styles.saveButtonText}>💾</Text>
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          style={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListFooterComponent={
            messages.length === 1 ? (
              <QuickActionButtons actions={quickActions} />
            ) : null
          }
        />

        <View style={styles.inputContainer}>
          <CustomInput
            style={[styles.input, { maxHeight: 100 }]}
            placeholder={t('ai_assistant_placeholder')}
            value={input}
            onChangeText={setInput}
            multiline
          />
          {loading ? (
            <View style={styles.loadingButton}>
              <ActivityIndicator size="small" color={colors.white} />
            </View>
          ) : (
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSend}
              disabled={!input.trim()}>
              <IconSvg xml={ImagesSvg.icSend} width={36} height={36} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>

      {/* Save Chat Modal */}
      <SaveChatModal
        visible={showSaveModal}
        isLoading={savingChat}
        onSave={handleSaveChat}
        onCancel={() => setShowSaveModal(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  headerWithButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  saveHeaderButton: {
    paddingRight: 16,
    paddingVertical: 8,
  },
  saveButtonText: {
    fontSize: 20,
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
    backgroundColor: colors.InputBg,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    marginRight: 8,
    fontSize: 16,
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