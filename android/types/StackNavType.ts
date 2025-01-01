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
    foodId: string;
    foodName?: string;
    categoryId: string;
    userId: string;
    foodDescription: string;
    foodIngredient: string;
    foodThumbnail: string;
    created_at: string;
    updated_at: string;
  };
  SettingPage: undefined;
  AddFoodPage: undefined;
  SettingProfilePage: undefined;
  changePasswordPage: undefined;
};
