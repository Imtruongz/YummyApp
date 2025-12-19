import React, { useState } from 'react';
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';
import { PaperProvider } from 'react-native-paper';
import './src/languages/i18n';
import { store } from './src/redux/store';
import { AuthContext } from './src/contexts/AuthContext';
import { LoadingProvider } from './src/contexts/LoadingContext';
import NavigationRoot from './src/navigation/NavigationContainer';
import { getStorageString, deleteStorageKey } from './src/utils';

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(!!getStorageString('accessToken'));

  return (
    <PaperProvider>
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
    </PaperProvider>
  );
}