import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingPage from '../pages/SettingPage';
import ChangePasswordPage from '../pages/ChangePasswordPage';
import SettingProfilePage from '../pages/SettingProfilePage';
import PaymentScreen from '../pages/PaymentScreen';
import BankAccountScreen from '../pages/BankAccountScreen';
import { RootStackParamList } from '../../android/types/StackNavType';

const Stack = createNativeStackNavigator<RootStackParamList>();

const SettingNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SettingPage" component={SettingPage} />
    <Stack.Screen name="ChangePasswordPage" component={ChangePasswordPage} />
    <Stack.Screen name="SettingProfilePage" component={SettingProfilePage} />
    <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
    <Stack.Screen name="BankAccountScreen" component={BankAccountScreen} />
  </Stack.Navigator>
);

export default SettingNavigator;
