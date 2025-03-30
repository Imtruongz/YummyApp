
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomePage from '../pages/HomePage';
import RecipeDetailPage from '../pages/RecipeDetailPage';
import ListFoodPage from '../pages/ListFoodPage';
import {HomeStack} from './types.ts'

const HomeStack = () => {
    const Stack = createNativeStackNavigator<HomeStack>();
    return (
        <Stack.Navigator>
          <Stack.Screen name="HomePage" component={HomePage} />
          <Stack.Screen name="RecipeDetailPage" component={RecipeDetailPage} />
          <Stack.Screen name="ListFoodPage" component={ListFoodPage} />
        </Stack.Navigator>
      );
}

export default HomeStack;