export interface FavoriteFood {
  favoriteFoodId: string;
  foodId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface FavoriteFoodPayload {
  userId: string;
  foodId: string;
}

export interface DeleteFavoriteFoodPayload {
  userId: string;
  favoriteFoodId: string;
}

export interface FavoriteFoodState {
  favoriteFoodList: FavoriteFood[];
  isLoadingFavorite: boolean;
  isErrorFavorite: boolean;
} 