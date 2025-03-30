import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import colors from '../utils/color';
import HomePage from '../pages/HomePage';
import ProfilePage from '../pages/ProfilePage';
import {MainStackParamList} from './types.ts'

import HomeNavigator from './HomeNavigator.tsx';
import ProfileNavigator from './ProfileNavigator.tsx';



const BottomTab = () => {
  const Tab = createBottomTabNavigator<MainStackParamList>();
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.dark,
          tabBarStyle: {
            backgroundColor: colors.light,
            borderTopWidth: 0,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 6,
            },
            shadowOpacity: 0.1,
            shadowRadius: 1,
            elevation: 10,
          },
        }}>
        <Tab.Screen
          name="HomeNavigator"
          component={HomeNavigator}
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
          name="ProfileNavigator"
          component={ProfileNavigator}
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

  export default BottomTab;