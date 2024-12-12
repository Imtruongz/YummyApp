import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';

import FoodPage from './pages/FoodPage';
import ProfilePage from './pages/ProfilePage';

const Tab = createBottomTabNavigator();

function BottomTab() {
  return (
    <Tab.Navigator
      >
      <Tab.Screen
        name="Home"
        component={HomePage}
        options={{
          tabBarLabel: 'Home',
          headerShown: false,
          tabBarLabelStyle: {color: 'black', marginBottom: 3},
        }}
      />
      <Tab.Screen
        name="Food"
        component={FoodPage}
        options={{
          tabBarLabel: 'Food',
          headerShown: false,
          tabBarLabelStyle: {color: 'black', marginBottom: 3},
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfilePage}
        options={{
          tabBarLabel: 'Profile',
          headerShown: false,
          tabBarLabelStyle: {color: 'black', marginBottom: 3},
        }}
      />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();

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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default StackNavigator;
