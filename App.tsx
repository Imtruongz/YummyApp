import React, { useState } from 'react';
import './src/languages/i18n'; // Import i18n trước
import { AuthContext } from './src/contexts/AuthContext';
import NavigationRoot from './src/navigation/NavigationContainer';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
// import Toast from 'react-native-toast-message';
import { MMKV } from 'react-native-mmkv';
import ErrorBoundary from './src/utils/errorBoundary';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useEffect } from 'react';
import { initFirebaseMessaging } from './src/utils/firebaseMessaging';
import Toast from 'react-native-toast-message';
import { updateFcmTokenApi } from './src/api/updateFcmTokenApi';

const storage = new MMKV();

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(!!storage.getString('accessToken'));
  
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    const setupFCM = async () => {
      unsubscribe = await initFirebaseMessaging(
        async (token) => {
          // Gửi token lên server nếu đã đăng nhập
          const accessToken = storage.getString('accessToken');
          if (accessToken) {
            try {
              await updateFcmTokenApi(token, accessToken);
              console.log('FCM Token sent to server:', token);
            } catch (err) {
              console.log('Failed to send FCM token to server:', err);
            }
          } else {
            console.log('FCM Token (not logged in):', token);
          }
        },
        (remoteMessage) => {
          Toast.show({
            type: 'info',
            text1: remoteMessage.notification?.title || 'Thông báo',
            text2: remoteMessage.notification?.body || '',
            visibilityTime: 4000,
          });
          console.log('FCM Notification:', remoteMessage);
        }
      );
    };
    setupFCM();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <ErrorBoundary>
          <AuthContext.Provider value={{
            isSignedIn,
            signIn: () => setIsSignedIn(true),
            signOut: () => {
              storage.delete('accessToken');
              setIsSignedIn(false);
            }
          }}>
            <Provider store={store}>
              <NavigationRoot />
              <Toast />
            </Provider>
          </AuthContext.Provider>
        </ErrorBoundary>
      </PaperProvider>
    </SafeAreaProvider>
  );
}