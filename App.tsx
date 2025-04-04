import React, { useState, useEffect } from 'react';
import './src/languages/i18n'; // Import i18n trước
import { AuthContext } from './src/contexts/AuthContext';
import NavigationRoot from './src/navigation/NavigationContainer';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import Toast from 'react-native-toast-message';
import { MMKV } from 'react-native-mmkv';
import firebase from '@react-native-firebase/app';
import crashlytics from '@react-native-firebase/crashlytics';
import { setUserIdentifier, setupGlobalErrorHandler } from './src/utils/crashlytics';
import { View, Text } from 'react-native';
import ErrorBoundary from './src/utils/errorBoundary';

// Bật thu thập dữ liệu Crashlytics
crashlytics().setCrashlyticsCollectionEnabled(true);

// Thiết lập global error handler
setupGlobalErrorHandler();

const storage = new MMKV();

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(!!storage.getString('accessToken'));
  
  useEffect(() => {
    // Cập nhật thông tin người dùng cho Crashlytics khi đăng nhập
    const setUserForCrashlytics = async () => {
      try {
        const userId = storage.getString('userId');
        if (isSignedIn && userId) {
          await setUserIdentifier(userId);
          // Ghi log hành động đăng nhập thành công
          await crashlytics().log('User signed in successfully');
        }
      } catch (error) {
        console.error('Failed to set user for crashlytics:', error);
      }
    };
    
    setUserForCrashlytics();
  }, [isSignedIn]);
  
  return (
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
  );
}