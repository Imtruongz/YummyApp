export interface review {
  reviewId: string;
  foodId: string;
  userId: string;
  rating: number;
  isLiked: boolean;
  reviewText: string;
  createdAt: string;
  userDetail: {
    userId: string;
    username: string;
    avatar: string;
  };
}

export interface reviewState {
  reviewList: review[];
  userReviewList: review[];
  foodReviewList: review[];
  selectedReview: review | null;
  isLoadingReview: boolean;
  isErrorReview: boolean;
}

export interface reviewPayload {
  foodId: string;
  userId: string;
  reviewText: string;
  rating: number;
  isLiked: boolean;
}
