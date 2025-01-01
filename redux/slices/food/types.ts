interface food {
  foodId: string,
  foodName: string,
  categoryId: string,
  userId: string
  foodDescription: string,
  foodIngredient: string,
  foodThumbnail: string,
  created_at: string
  updated_at: string
}

interface foodState {
  foodList: food[]
  isLoadingFood: boolean;
  isErrorFood: boolean;
}

export type {food, foodState};
