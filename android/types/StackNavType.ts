export type RootStackParamList = {
  // auth, user page
  LoginScreen: undefined;
  SignUpPage: undefined;
  VerifyEmailScreen: { email: string; flowType?: 'signup' | 'forgotPassword' };
  ForgotPasswordPage: undefined;
  ResetPasswordPage: { email: string; verificationCode?: string };
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
  EditFoodScreen: {
    foodId: string;
  };
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
  LFXWebViewDemoScreen: {
    initialUrl?: string;
    allowedHosts?: string[];
  } | undefined;
};
