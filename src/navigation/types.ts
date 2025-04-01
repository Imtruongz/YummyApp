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
  };

  export type HomeStack = {
    HomePage: undefined
    AddFoodPage: undefined;
    ListFoodPage: undefined
    RecipeDetailPage: undefined;
    ListFoodByUserPage: undefined;
    ListFoodByCategoriesPage: undefined;
  }

  export type ProfileStack = {
    SettingPage: undefined;
    ProfilePage: undefined;
  }