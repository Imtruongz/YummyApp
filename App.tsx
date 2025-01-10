import React from 'react';
import Navigation from './StackNavigator';

import {Provider} from 'react-redux';
import {store} from './redux/store';
import Toast from 'react-native-toast-message';

export default function App() {
  return (
      <Provider store={store}>
        <Navigation />
        <Toast />
      </Provider>
  );
}
