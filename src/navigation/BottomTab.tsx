import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import {colors} from '@/utils';
import HomeNavigator from './HomeNavigator.tsx';
import ProfileNavigator from './ProfileNavigator.tsx';
import { MainStackParamList } from './types.ts';
import AddFoodPage from '../pages/AddFoodPage.tsx';
import SearchPage from '../pages/SearchPage.tsx';
import SettingNavigator from './SettingNavigator';
import IconSvg from '../components/IconSvg.tsx';
import { ImagesSvg } from '../utils/ImageSvg.tsx';

const BottomTab = () => {
  const Tab = createBottomTabNavigator<MainStackParamList>();
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HomeNavigator"
        component={HomeNavigator}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({color}) => (
            <IconSvg xml={ImagesSvg.icHome} width={100} height={30} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SearchPage"
        component={SearchPage}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({color}) => (
            <IconSvg xml={ImagesSvg.icSearch} width={100} height={30} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AddFoodPage"
        component={AddFoodPage}
        options={{
          tabBarLabel: '',
          tabBarIcon: () => (
            <View />
          ),
        }}
        listeners={({ navigation }: any) => ({
          tabPress: (e: any) => {
            e.preventDefault();
            navigation.navigate('AddFoodPage');
          },
        })}
      />
      <Tab.Screen
        name="ProfileNavigator"
        component={ProfileNavigator}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({color}) => (
            <IconSvg xml={ImagesSvg.icUser} width={23} height={27} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SettingNavigator"
        component={SettingNavigator}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({color}) => (
            <IconSvg xml={ImagesSvg.icGear} width={32} height={32} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  // Kiểm tra nếu đang ở các trang chi tiết thì ẩn tab bar
  let hideTabBar = false;
  // Kiểm tra trong HomeNavigator
  const homeRoute = state.routes.find((r: any) => r.name === 'HomeNavigator');
  if (homeRoute && homeRoute.state && homeRoute.state.routes) {
    const nested = homeRoute.state.routes[homeRoute.state.index];
    if (nested && (
      nested.name === 'RecipeDetailPage' ||
      nested.name === 'AddFoodPage' ||
      nested.name === 'ListFoodByCategoriesPage' ||
      nested.name === 'ListFoodByUserPage' ||
      nested.name === 'ListFoodPage' ||
      nested.name === 'PaymentScreen' ||
      nested.name === 'PaymentSuccessScreen' || // Ẩn tab bar ở màn thành công
      nested.name === 'YummyAIScreen' ||
      nested.name === 'ChatHistory' ||
      nested.name === 'NotificationsScreen'
    )) {
      hideTabBar = true;
    }
  }
  // Kiểm tra trong SettingNavigator
  const settingRoute = state.routes.find((r: any) => r.name === 'SettingNavigator');
  if (settingRoute && settingRoute.state && settingRoute.state.routes) {
    const nested = settingRoute.state.routes[settingRoute.state.index];
    if (nested && (
      nested.name === 'SettingProfilePage' ||
      nested.name === 'ChangePasswordPage' ||
      nested.name === 'PaymentScreen' ||
      nested.name === 'BankAccountScreen'
    )) {
      hideTabBar = true;
    }
  }
  // Kiểm tra trong ProfileNavigator
  const profileRoute = state.routes.find((r: any) => r.name === 'ProfileNavigator');
  if (profileRoute && profileRoute.state && profileRoute.state.routes) {
    const nested = profileRoute.state.routes[profileRoute.state.index];
    if (nested && (
      nested.name === 'RecipeDetailPage' ||
      nested.name === 'AddFoodPage' ||
      nested.name === 'ListFoodByCategoriesPage' ||
      nested.name === 'ListFoodByUserPage' ||
      nested.name === 'ListFoodPage' ||
      nested.name === 'FollowersFollowingListScreen'
    )) {
      hideTabBar = true;
    }
  }
  // Kiểm tra nếu tab hiện tại là AddFoodPage (tab giữa)
  if (state.routes[state.index]?.name === 'AddFoodPage') {
    hideTabBar = true;
  }
  if (hideTabBar) return null;
  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;
        const isFocused = state.index === index;
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };
        if (route.name === 'AddFoodPage') {
          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              style={styles.fabWrapper}
              activeOpacity={0.8}
            >
              <View style={styles.fabContainer}>
                <IconSvg xml={ImagesSvg.icPlus} width={32} height={32} color='white' />
              </View>
            </TouchableOpacity>
          );
        }
        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            style={styles.tabItem}
            activeOpacity={0.7}
          >
            {options.tabBarIcon &&
              options.tabBarIcon({
                focused: isFocused,
                color: isFocused ? colors.primary : colors.dark,
                size: 26,
              })}
            <Text style={[styles.tabLabel, isFocused && styles.tabLabelFocused]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: colors.light,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: 64,
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    zIndex: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabLabel: {
    fontSize: 12,
    color: colors.dark,
    marginTop: 2,
  },
  tabLabelFocused: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  fabWrapper: {
    position: 'relative',
    top: -20,
    zIndex: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 90,
  },
  fabContainer: {
    width: 54,
    height: 54,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 16,
  },
  fabFocused: {
    backgroundColor: colors.primary,
  },
});

export default BottomTab;