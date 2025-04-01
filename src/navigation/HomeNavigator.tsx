import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import AddFoodPage from '../pages/AddFoodPage';
import RecipeDetailPage from '../pages/RecipeDetailPage';
import HomePage from '../pages/HomePage';
import ListFoodPage from '../pages/ListFoodPage';
import {HomeStack} from './types'
import ListFoodByUser from '../pages/ListFoodByUser';
import ListFoodByCategoriesPage from '../pages/ListFoodByCategoriesPage';

const HomeNavigator = () => {
  const Stack = createNativeStackNavigator<HomeStack>();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="HomePage" component={HomePage} />
      <Stack.Screen name="AddFoodPage" component={AddFoodPage} />
      <Stack.Screen name="ListFoodPage" component={ListFoodPage} />

      <Stack.Screen name="RecipeDetailPage" component={RecipeDetailPage} />
      <Stack.Screen name="ListFoodByUserPage" component={ListFoodByUser} />
      <Stack.Screen name="ListFoodByCategoriesPage" component={ListFoodByCategoriesPage} />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
