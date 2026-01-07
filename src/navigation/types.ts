export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  LoginScreen: undefined;
  SignUpPage: undefined;
  VerifyEmailScreen: { email: string; flowType?: 'signup' | 'forgotPassword' };
  ForgotPasswordPage: undefined;
  ResetPasswordPage: { email: string; verificationCode?: string };
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
  FollowScreen: { userId: string; type: 'followers' | 'following' };
};

export type HomeStack = {
  HomeScreen: undefined;
  NewFoodScreen: undefined;
  EditFoodScreen: {
    foodId: string;
  };
  ListFoodScreen: undefined;
  FollowingFeedScreen: undefined;
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
  YummyAIScreen: {
    presetMessages?: Array<{
      id: string;
      text: string;
      isUser: boolean;
      timestamp?: string;
    }>;
    conversationId?: string;
  } | undefined;
  ChatHistory: undefined;
  ChatDetailScreen: { conversationId: string };
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

// Stack for SettingNavigator
export type SettingStack = {
  SettingScreen: undefined;
  ChangePasswordScreen: undefined;
  SettingProfileScreen: undefined;
  PaymentScreen: {
    userId: string;
    amount?: number;
    phoneNumber?: string;
    serviceType?: string;
    serviceProvider?: string;
  };
  BankAccountScreen: undefined;
  HomeScreen: undefined;
  LFXWebViewDemoScreen: {
    initialUrl?: string;
    allowedHosts?: string[];
  } | undefined;
}