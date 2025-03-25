import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {RootStackParamList} from './android/types/StackNavType';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import colors from './utils/color';
//auth
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
//main
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import SettingPage from './pages/SettingPage';
import AddFoodPage from './pages/AddFoodPage';
import SettingProfilePage from './pages/SettingProfilePage';
import ListFoodPage from './pages/ListFoodPage';
import ListFoodByCategoriesPage from './pages/ListFoodByCategoriesPage';
import ListFoodByUser from './pages/ListFoodByUser';

import {MMKV} from 'react-native-mmkv';
const storage = new MMKV();

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
  const accessToken = storage.getString('accessToken') || '';
  console.log('accessToken', accessToken);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {!accessToken ? (
          <>
            <Stack.Screen name="LoginPage" component={LoginPage} />
            <Stack.Screen name="SignUpPage" component={SignUpPage} />
            <Stack.Screen
              name="ForgotPasswordPage"
              component={ForgotPasswordPage}
            />
            <Stack.Screen name="BottomTabs" component={BottomTab} />
          </>
        ) : (
          <>
            <Stack.Screen name="BottomTabs" component={BottomTab} />
            <Stack.Screen name="ProfilePage" component={ProfilePage} />
            <Stack.Screen name="HomePage" component={HomePage} />
            <Stack.Screen
              name="RecipeDetailPage"
              component={RecipeDetailPage}
            />
            <Stack.Screen name="SettingPage" component={SettingPage} />
            <Stack.Screen name="ListFoodPage" component={ListFoodPage} />
            <Stack.Screen
              name="ListFoodByUserPage"
              component={ListFoodByUser}
            />
            <Stack.Screen
              name="ListFoodByCategoriesPage"
              component={ListFoodByCategoriesPage}
            />
            <Stack.Screen
              name="ChangePasswordPage"
              component={ChangePasswordPage}
            />
            <Stack.Screen name="LoginPage" component={LoginPage} />
            <Stack.Screen
              name="SettingProfilePage"
              component={SettingProfilePage}
            />
            <Stack.Screen name="AddFoodPage" component={AddFoodPage} />
          </>
        )}
      </Stack.Navigator>

      {/* auth, user page */}
      {/* <Stack.Screen name="LoginPage" component={LoginPage} />
        <Stack.Screen name="SignUpPage" component={SignUpPage} />
        <Stack.Screen name="ForgotPasswordPage" component={ForgotPasswordPage} /> */}

      {/* main */}
      {/* <Stack.Screen name="BottomTabs" component={BottomTab} />
        <Stack.Screen name="ProfilePage" component={ProfilePage} />
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen name="RecipeDetailPage" component={RecipeDetailPage} />
        <Stack.Screen name="SettingPage" component={SettingPage} />
        <Stack.Screen name="AddFoodPage" component={AddFoodPage} />
        <Stack.Screen name="ListFoodPage" component={ListFoodPage} />
        <Stack.Screen name="ListFoodByUserPage" component={ListFoodByUser} />
        <Stack.Screen
          name="ListFoodByCategoriesPage"
          component={ListFoodByCategoriesPage}
        />
        <Stack.Screen
          name="SettingProfilePage"
          component={SettingProfilePage}
        />
        <Stack.Screen
          name="ChangePasswordPage"
          component={ChangePasswordPage}
        /> */}
    </NavigationContainer>
  );
}
export default StackNavigator;