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
  HomePage: undefined;
  ProfilePage: { userId: string };
  Settings: undefined;
  HomeNavigator: undefined;
  ProfileNavigator: undefined;
  AddFoodPage: undefined;
  SearchPage: undefined;
  SettingPage: undefined;
  SettingNavigator: undefined;
  NotificationsScreen: undefined;
};

export type HomeStack = {
  HomePage: undefined;
  AddFoodPage: undefined;
  ListFoodPage: undefined;
  RecipeDetailPage: {
    foodId: string;
    userId: string;
  };
  ListFoodByCategoriesPage: {
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
  SettingPage: undefined;
  ProfilePage: {
    email: string;
  };
  ChangePasswordPage: undefined,
  SettingProfilePage: undefined,
  RecipeDetailPage: {
    foodId: string;
    userId: string;
  };
  FollowersFollowingListScreen: {
    userId: string;
    type: 'followers' | 'following';
  };
}