import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';
import { PaperProvider } from 'react-native-paper';
import './src/languages/i18n';
import { store } from './src/redux/store';
import ErrorBoundary from './src/utils/errorBoundary';
import { AuthContext } from './src/contexts/AuthContext';
import { LoadingProvider } from './src/contexts/LoadingContext';
import { updateFcmTokenApi } from './src/api/updateFcmTokenApi';
import NavigationRoot from './src/navigation/NavigationContainer';
import { initFirebaseMessaging } from './src/utils/firebaseMessaging';
import { showToast, getStorageString, deleteStorageKey } from './src/utils';

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(!!getStorageString('accessToken'));

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    const setupFCM = async () => {
      unsubscribe = await initFirebaseMessaging(
        async (token) => {
          const accessToken = getStorageString('accessToken');
          if (accessToken) {
            try {
              await updateFcmTokenApi(token, accessToken);
            } catch (err) {
              console.log('Failed to send FCM token to server:', err);
            }
          }
        },
        (remoteMessage) => {
          showToast.info(remoteMessage.notification?.title, remoteMessage.notification?.body);
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
            deleteStorageKey('accessToken');
            setIsSignedIn(false);
          }
        }}>
          <LoadingProvider>
            <Provider store={store}>
              <NavigationRoot />
              <Toast />
            </Provider>
          </LoadingProvider>
        </AuthContext.Provider>
      </ErrorBoundary>
    </PaperProvider>
  );
}