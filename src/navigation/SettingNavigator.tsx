import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingPage from '../pages/SettingPage';
import ChangePasswordPage from '../pages/ChangePasswordPage';
import SettingProfilePage from '../pages/SettingProfilePage';

const Stack = createNativeStackNavigator();

const SettingNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SettingPage" component={SettingPage} />
    <Stack.Screen name="ChangePasswordPage" component={ChangePasswordPage} />
    <Stack.Screen name="SettingProfilePage" component={SettingProfilePage} />
  </Stack.Navigator>
);

export default SettingNavigator;
