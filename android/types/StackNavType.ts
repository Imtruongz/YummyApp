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
    idMeal?: string;
    strMeal?: string;
    strIngredient1?: string;
    strInstructions?: string;
    strMealThumb?: string;
    strCategory?: string;
    strYouTube?: string;
  };
  SettingPage: undefined;
};
