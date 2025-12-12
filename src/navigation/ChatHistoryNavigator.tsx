import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import ChatHistoryScreen from '../pages/YummyAI/screens/ChatHistoryScreen';
import ChatDetailScreen from '../pages/YummyAI/screens/ChatDetailScreen';

const Stack = createNativeStackNavigator();

const ChatHistoryNavigator = () => {
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="ChatHistoryList"
        component={ChatHistoryScreen}
        options={{
          title: t('chatHistory.title') || 'Chat History',
        }}
      />
      <Stack.Screen
        name="ChatDetailScreen"
        component={ChatDetailScreen}
        options={{
          title: t('chatHistory.title') || 'Chat History',
        }}
      />
    </Stack.Navigator>
  );
};

export default ChatHistoryNavigator;
