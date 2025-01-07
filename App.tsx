import React from 'react';
import Navigation from './StackNavigator';

import {Provider} from 'react-redux';
import {store} from './redux/store';
import Toast from 'react-native-toast-message';

import {AppStateProvider} from './contexts/app-state';

export default function App() {
  return (
    <AppStateProvider>
      <Provider store={store}>
        <Navigation />
        <Toast />
      </Provider>
    </AppStateProvider>
  );
}
