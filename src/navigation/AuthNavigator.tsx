
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../pages/auth/LoginScreen.tsx';
import SignupPage from '../pages/auth/SignUpPage.tsx';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage.tsx';
import VerifyEmailScreen from '../pages/auth/VerifyEmailScreen.tsx';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage.tsx';
import { AuthStackParamList } from './types.ts'

const AuthNavigator = () => {
  const Stack = createNativeStackNavigator<AuthStackParamList>();
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
    }}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignUpPage" component={SignupPage} />
      <Stack.Screen name="VerifyEmailScreen" component={VerifyEmailScreen} />
      <Stack.Screen name="ForgotPasswordPage" component={ForgotPasswordPage} />
      <Stack.Screen name="ResetPasswordPage" component={ResetPasswordPage} />
    </Stack.Navigator>
  );
}

export default AuthNavigator;