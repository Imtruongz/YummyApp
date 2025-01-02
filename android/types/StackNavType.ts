// Root params list
export type RootStackParamList = {
  LoginPage: undefined;
  BottomTabs: undefined;
  HomePage: undefined;
  SignUpPage: undefined;
  ForgotPasswordPage: undefined;
  ProfilePage: {
    email: string;
  };
  FoodPage: undefined;
  RecipeDetailPage: {
    foodId?: string;
  };
  SettingPage: undefined;
  AddFoodPage: undefined;
  SettingProfilePage: undefined;
  changePasswordPage: undefined;
  ListFoodPage: undefined;
};
