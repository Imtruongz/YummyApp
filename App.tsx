import React from 'react';
import Navigation from './StackNavigator';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

import {Provider} from 'react-redux';
import {store} from './redux/store';

GoogleSignin.configure({
  webClientId:
    '427718029425-0bm7kmlq54kodu4evbvu4mphec49sag6.apps.googleusercontent.com',
});
export default function App() {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
}
