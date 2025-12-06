import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import NewFoodScreen from '../pages/NewFoodScreen';
import FoodDetailScreen from '../pages/FoodDetailScreen';
import HomeScreen from '../pages/HomeScreen';
import ListFoodScreen from '../pages/ListFoodScreen';
import {HomeStack} from './types'
import UsersProfileScreen from '../pages/UsersProfileScreen';
import CategoriesScreen from '../pages/CategoriesScreen';
import NotificationsScreen from '../pages/NotificationsScreen';
import PaymentScreen from '../pages/PaymentScreen';
import PaymentSuccessScreen from '../pages/PaymentSuccessScreen';
import YummyAIScreen from '../pages/YummyAI/screens/YummyAIScreen';
import ChatHistoryNavigator from './ChatHistoryNavigator';

const HomeNavigator = () => {
  const Stack = createNativeStackNavigator<HomeStack>();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="FoodDetailScreen" component={FoodDetailScreen} />
      <Stack.Screen name="NewFoodScreen" component={NewFoodScreen} />
      <Stack.Screen name="ListFoodScreen" component={ListFoodScreen} />
      <Stack.Screen name="YummyAIScreen" component={YummyAIScreen} />
      <Stack.Screen name="ChatHistory" component={ChatHistoryNavigator} />
      <Stack.Screen name="ListFoodByUserPage" component={UsersProfileScreen} />
      <Stack.Screen name="CategoriesScreen" component={CategoriesScreen} />
      <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
  <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
  <Stack.Screen name="PaymentSuccessScreen" component={PaymentSuccessScreen} />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
