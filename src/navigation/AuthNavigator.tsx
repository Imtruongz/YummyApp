
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignUpPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import { AuthStackParamList } from './types.ts'

const AuthNavigator = () => {
  const Stack = createNativeStackNavigator<AuthStackParamList>();
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
    }}>
      <Stack.Screen name="LoginPage" component={LoginPage} />
      <Stack.Screen name="SignUpPage" component={SignupPage} />
      <Stack.Screen name="ForgotPasswordPage" component={ForgotPasswordPage} />
    </Stack.Navigator>
  );
}

export default AuthNavigator;