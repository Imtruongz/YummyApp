export type RootStackParamList = {
  // auth, user page
  LoginScreen: undefined;
  SignUpPage: undefined;
  ForgotPasswordPage: undefined;
  changePasswordPage: undefined;
  // main
  BottomTabs: undefined;
  HomeScreen: undefined;
  ProfileScreen: {
    email: string;
  };
  FoodDetailScreen: {
    foodId: string;
    userId: string;
  };
  SettingScreen: undefined;
  NewFoodScreen: undefined;
  SettingProfileScreen: undefined;
  ListFoodScreen: undefined;
  CategoriesScreen: {
    categoryId?: string;
  };
  ListFoodByUserPage: {
    userId: string;
  };
  OnBoarding: undefined;
  ChangePasswordScreen: undefined;
  PaymentScreen: {
    userId: string;
    amount?: number;
    phoneNumber?: string;
    serviceType?: string;
    serviceProvider?: string;
  };
  BankAccountScreen: undefined;
  PaymentSuccessScreen: undefined;
  YummyAIScreen: undefined;
};
