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
  RecipeDetailPage: {
    foodId: string;
    userId?: string;
  };
  SettingPage: undefined;
  AddFoodPage: undefined;
  SettingProfilePage: undefined;
  changePasswordPage: undefined;
  ListFoodPage: undefined;
  ListFoodByCategoriesPage: {
    categoryId?: string;
  };
  ListFoodByUserPage: {
    userId: string;
  };
};
