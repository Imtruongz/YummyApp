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
  difficultyLevel?: string;
  servings?: number;
  createdAt: string;
  updated_at: string;
  averageRating?: number;
  totalRatings?: number;
  userDetail: {
    userId: string;
    username: string;
    email: string;
    avatar: string;
    createdAt: string;
    updated_at: string;
  };
  categoryDetail?: {
    categoryId: string;
    categoryName: string;
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
  difficultyLevel?: string;
  servings?: number;
}

export interface foodState {
  foodList: food[];
  searchFoodList: food[];
  userFoodList: food[];
  viewedUserFoodList: food[];
  categoryFoodList: food[];
  selectedFood: food | null
  isLoadingFood: boolean;
  isErrorFood: boolean;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
  }
}
