import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import HomePage from './pages/HomePage';

import FoodPage from './pages/FoodPage';
import ProfilePage from './pages/ProfilePage';
import {RootStackParamList} from './android/types/StackNavType';

import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import colors from './utils/color';
import RecipeDetailPage from './pages/RecipeDetailPage';
import SettingPage from './pages/SettingPage';
import AddFoodPage from './pages/AddFoodPage';
import SettingProfilePage from './pages/SettingProfilePage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import ListFoodPage from './pages/ListFoodPage';

const Tab = createBottomTabNavigator<RootStackParamList>();
function BottomTab() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.dark,
        tabBarStyle: {
          backgroundColor: colors.light,
          borderTopWidth: 0,
          elevation: 0,
        },
      }}>
      <Tab.Screen
        name="HomePage"
        component={HomePage}
        options={{
          tabBarLabel: '',
          headerShown: false,
          tabBarLabelStyle: {color: 'black', marginBottom: 1},
          tabBarIcon: ({color, size}) => (
            <AntDesignIcon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfilePage"
        component={ProfilePage}
        options={{
          tabBarLabel: '',
          headerShown: false,
          tabBarLabelStyle: {color: colors.dark, marginBottom: 1},
          tabBarIcon: ({color, size}) => (
            <AntDesignIcon name="user" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function StackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="LoginPage"
          component={LoginPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="BottomTabs"
          component={BottomTab}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="HomePage"
          component={HomePage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SignUpPage"
          component={SignUpPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ForgotPasswordPage"
          component={ForgotPasswordPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ProfilePage"
          component={ProfilePage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="FoodPage"
          component={FoodPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="RecipeDetailPage"
          component={RecipeDetailPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SettingPage"
          component={SettingPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AddFoodPage"
          component={AddFoodPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SettingProfilePage"
          component={SettingProfilePage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="changePasswordPage"
          component={ChangePasswordPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ListFoodPage"
          component={ListFoodPage}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default StackNavigator;
