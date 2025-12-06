import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { MMKV } from 'react-native-mmkv';
import Toast from 'react-native-toast-message';
import { PaperProvider } from 'react-native-paper';
import './src/languages/i18n';
import { store } from './src/redux/store';
import ErrorBoundary from './src/utils/errorBoundary';
import { AuthContext } from './src/contexts/AuthContext';
import { updateFcmTokenApi } from './src/api/updateFcmTokenApi';
import NavigationRoot from './src/navigation/NavigationContainer';
import { initFirebaseMessaging } from './src/utils/firebaseMessaging';
import { NotificationProvider } from './src/contexts/NotificationContext';

const storage = new MMKV();

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(!!storage.getString('accessToken'));
  
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    const setupFCM = async () => {
      unsubscribe = await initFirebaseMessaging(
        async (token) => {
          const accessToken = storage.getString('accessToken');
          if (accessToken) {
            try {
              await updateFcmTokenApi(token, accessToken);
            } catch (err) {
              console.log('Failed to send FCM token to server:', err);
            }
          }
        },
        (remoteMessage) => {
          Toast.show({
            type: 'info',
            text1: remoteMessage.notification?.title || 'Thông báo',
            text2: remoteMessage.notification?.body || '',
            visibilityTime: 4000,
          });
        }
      );
    };
    setupFCM();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
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
              <NotificationProvider>
                <NavigationRoot />
                <Toast />
              </NotificationProvider>
            </Provider>
          </AuthContext.Provider>
        </ErrorBoundary>
      </PaperProvider>
  );
}