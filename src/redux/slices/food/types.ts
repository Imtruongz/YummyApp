export interface food {
  foodId: string;
  foodName: string;
  categoryId: string;
  userId: string;
  foodDescription: string;
  foodIngredients: string[];
  foodThumbnail: string;
  foodSteps: string[];
  CookingTime: string;
  createdAt: string;
  updated_at: string;
  userDetail: {
    userId: string;
    username: string;
    email: string;
    avatar: string;
    createdAt: string;
    updated_at: string;
  };
}

export interface foodPayload {
  foodName: string;
  categoryId: string;
  userId: string;
  foodDescription: string;
  foodIngredients: string[];
  foodThumbnail: string;
  foodSteps: string[];
  CookingTime: string;
}

export interface foodState {
  foodList: food[];
  userFoodList: food[];
  categoryFoodList: food[];
  selectedFood: food | null
  isLoadingFood: boolean;
  isErrorFood: boolean;
}
