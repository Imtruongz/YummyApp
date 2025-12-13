import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingScreen from '../pages/Setting/SettingScreen';
import ChangePasswordScreen from '@/pages/Setting/ChangePasswordScreen';
import SettingProfileScreen from '@/pages/Setting/SettingProfileScreen';
import PaymentScreen from '../pages/Payment/PaymentScreen';
import BankAccountScreen from '../pages/Setting/BankAccountScreen';
import HomeScreen from '../pages/HomeScreen';
import { RootStackParamList } from '../../android/types/StackNavType';

const Stack = createNativeStackNavigator<RootStackParamList>();

const SettingNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SettingScreen" component={SettingScreen} />
    <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
    <Stack.Screen name="SettingProfileScreen" component={SettingProfileScreen} />
    <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
    <Stack.Screen name="BankAccountScreen" component={BankAccountScreen} />
    <Stack.Screen name="HomeScreen" component={HomeScreen} />
  </Stack.Navigator>
);

export default SettingNavigator;
