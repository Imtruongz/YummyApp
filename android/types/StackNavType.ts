export type RootStackParamList = {
  // auth, user page
  LoginPage: undefined;
  SignUpPage: undefined;
  ForgotPasswordPage: undefined;
  changePasswordPage: undefined;
  // main
  BottomTabs: undefined;
  HomePage: undefined;
  ProfilePage: {
    email: string;
  };
  RecipeDetailPage: {
    foodId: string;
    userId: string;
  };
  SettingPage: undefined;
  AddFoodPage: undefined;
  SettingProfilePage: undefined;
  ListFoodPage: undefined;
  ListFoodByCategoriesPage: {
    categoryId?: string;
  };
  ListFoodByUserPage: {
    userId: string;
  };
  OnBoarding: undefined;
  ChangePasswordPage: undefined;
};
