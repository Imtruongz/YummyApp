export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  LoginPage: undefined;
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
    amount?: number;
    phoneNumber?: string;
    serviceType?: string;
    serviceProvider?: string;
  };
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