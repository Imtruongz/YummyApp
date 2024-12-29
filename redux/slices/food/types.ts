interface food {
  foodId: string,
  foodName: string,
  categoryId: string,
  userId: string
  foodDescription: string,
  foodIngredient: string,
  foodThumbnail: string,
  created_at: Date
  updated_at: Date
}

interface foodState {
  foodList: food[] | null;
  isLoadingFood: boolean;
  isErrorFood: boolean;
}

export type {food, foodState};
