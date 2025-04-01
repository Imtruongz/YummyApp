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
};

export type HomeStack = {
  HomePage: undefined
  AddFoodPage: undefined;
  ListFoodPage: undefined
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
}

export type ProfileStack = {
  SettingPage: undefined;
  ProfilePage: {
    email: string;
  };
}