import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Typography from '../components/customize/Typography';
import { aiApi } from '../api/aiApi';
import Toast from 'react-native-toast-message';
import colors from '../utils/color';
import HomeHeader from '../components/HomeHeader';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../android/types/StackNavType';
import { YummyDrag } from '../utils/assets';
import { Image } from 'react-native';
import IconSvg from '../components/IconSvg';
import { ImagesSvg } from '../utils/ImageSvg';
import CustomInput from '../components/customize/CustomInput';

type Message = {
  id: string;
  text: string;
  isUser: boolean;
};

type YummyAIScreenProps = NativeStackScreenProps<RootStackParamList, 'YummyAIScreen'>;

const YummyAIScreen: React.FC<YummyAIScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: t('ai_assistant_welcome'),
      isUser: false,
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
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
        <HomeHeader
          mode="back"
          title={t('ai_assistant_title')}
          showNotification={false}
          showGoBack={true}
        />

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          style={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
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