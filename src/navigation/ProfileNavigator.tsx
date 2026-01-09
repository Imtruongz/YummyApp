import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ProfileStack } from './types'
import ProfileScreen from '../pages/Profile/ProfileScreen';
import SettingScreen from '../pages/Setting/SettingScreen';
import FoodDetailScreen from '../pages/FoodDetailScreen';
import FollowScreen from '../pages/FollowScreen';
import UsersProfileScreen from '../pages/UsersProfileScreen';

const ProfileNavigator = () => {
  const Stack = createNativeStackNavigator<ProfileStack>();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>

      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="SettingScreen" component={SettingScreen} />
      <Stack.Screen name="FoodDetailScreen" component={FoodDetailScreen} />
      <Stack.Screen name="FollowScreen" component={FollowScreen} />
      <Stack.Screen name="ListFoodByUserPage" component={UsersProfileScreen} />

    </Stack.Navigator>
  );
};

export default ProfileNavigator;
