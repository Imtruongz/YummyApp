export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  LoginScreen: undefined;
  SignUpPage: undefined;
  ForgotPasswordPage: undefined;
};

export type MainStackParamList = {
  HomeScreen: undefined;
  ProfileScreen: { userId: string };
  Settings: undefined;
  HomeNavigator: undefined;
  ProfileNavigator: undefined;
  NewFoodScreen: undefined;
  SearchScreen: undefined;
  SettingScreen: undefined;
  SettingNavigator: undefined;
  NotificationsScreen: undefined;
};

export type HomeStack = {
  HomeScreen: undefined;
  NewFoodScreen: undefined;
  ListFoodScreen: undefined;
  FoodDetailScreen: {
    foodId: string;
    userId: string;
  };
  CategoriesScreen: {
    categoryId?: string;
  };
  ListFoodByUserPage: {
    userId: string;
  };
  NotificationsScreen: undefined;
  PaymentScreen: {
    userId: string;
    amount?: number;
    phoneNumber?: string;
    serviceType?: string;
    serviceProvider?: string;
  };
  PaymentSuccessScreen: undefined;
  YummyAIScreen: undefined;
  ChatHistory: undefined;
}

export type ProfileStack = {
  SettingScreen: undefined;
  ProfileScreen: {
    email: string;
  };
  ChangePasswordScreen: undefined,
  SettingProfileScreen: undefined,
  FoodDetailScreen: {
    foodId: string;
    userId: string;
  };
  FollowScreen: {
    userId: string;
    type: 'followers' | 'following';
  };
}