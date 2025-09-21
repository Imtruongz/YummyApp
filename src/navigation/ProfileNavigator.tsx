import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {ProfileStack} from './types'
import ProfilePage from '../pages/ProfilePage';
import SettingPage from '../pages/SettingPage';
import RecipeDetailPage from '../pages/RecipeDetailPage';
import FollowersFollowingListScreen from '../pages/FollowersFollowingListScreen';

const ProfileNavigator = () => {
  const Stack = createNativeStackNavigator<ProfileStack>();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>

    <Stack.Screen name="ProfilePage" component={ProfilePage} />
    <Stack.Screen name="SettingPage" component={SettingPage} />
    <Stack.Screen name="RecipeDetailPage" component={RecipeDetailPage} />
    <Stack.Screen name="FollowersFollowingListScreen" component={FollowersFollowingListScreen} />

    </Stack.Navigator>
  );
};

export default ProfileNavigator;
