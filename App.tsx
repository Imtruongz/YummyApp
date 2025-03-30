import React, { useState } from 'react';
import { AuthContext } from './src/contexts/AuthContext';
import NavigationRoot from './src/navigation/NavigationContainer';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import Toast from 'react-native-toast-message';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(!!storage.getString('accessToken'));
  
  return (
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
  );
}