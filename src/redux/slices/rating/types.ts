export interface RatingStats {
  averageRating: number;
  totalRatings: number;
}

export interface RatingPayload {
  foodId: string;
  userId: string;
  rating: number;
}

export interface UserRating {
  rating: number;
}

export interface RatingState {
  isLoadingRating: boolean;
  isErrorRating: boolean;
}
