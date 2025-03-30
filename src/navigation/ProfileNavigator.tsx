import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {ProfileStack} from './types'
import ProfilePage from '../pages/ProfilePage';
import SettingPage from '../pages/SettingPage';

const ProfileNavigator = () => {
  const Stack = createNativeStackNavigator<ProfileStack>();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="ProfilePage" component={ProfilePage} />
      <Stack.Screen name="SettingPage" component={SettingPage} />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
