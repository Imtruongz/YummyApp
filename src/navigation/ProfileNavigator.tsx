import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {ProfileStack} from './types'
import ProfilePage from '../pages/ProfilePage';
import SettingPage from '../pages/SettingPage';
import ChangePasswordPage from '../pages/ChangePasswordPage';
import SettingProfilePage from '../pages/SettingProfilePage';

const ProfileNavigator = () => {
  const Stack = createNativeStackNavigator<ProfileStack>();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="ProfilePage" component={ProfilePage} />
      <Stack.Screen name="SettingPage" component={SettingPage} />
      <Stack.Screen name="ChangePasswordPage" component={ChangePasswordPage} />
      <Stack.Screen name="SettingProfilePage" component={SettingProfilePage} />

    </Stack.Navigator>
  );
};

export default ProfileNavigator;
