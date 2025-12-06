/**
 * Centralized export for all Redux selectors
 * This file aggregates selectors from all slices for easy importing
 * 
 * Usage:
 * import { selectFoodList, selectIsLoadingFood } from '@/redux/selectors';
 */

// Food selectors
export {
  selectFoodState,
  selectFoodList,
  selectUserFoodList,
  selectViewedUserFoodList,
  selectCategoryFoodList,
  selectSelectedFood,
  selectIsLoadingFood,
  selectFoodError,
  selectFoodListWithLength,
} from '../slices/food/selectors';

// Auth selectors
export {
  selectAuthState,
  selectUser,
  selectIsLoadingUser,
  selectAuthError,
  selectUserId,
  selectViewedUser,
  selectListUser,
} from '../slices/auth/selectors';

// Category selectors
export {
  selectCategoriesState,
  selectCategoryList,
  selectIsLoadingCategory,
  selectCategoryError,
  selectCategoryById,
} from '../slices/category/selectors';

// Review selectors
export {
  selectReviewState,
  selectReviewList,
  selectUserReviewList,
  selectFoodReviewList,
  selectSelectedReview,
  selectIsLoadingReview,
  selectReviewError,
  selectFoodReviewCount,
} from '../slices/review/selectors';

// Rating selectors
export {
  selectRatingState,
  selectIsLoadingRating,
  selectRatingError,
} from '../slices/rating/selectors';

// Favorite selectors
export {
  selectFavoriteState,
  selectFavoriteFoodList,
  selectIsLoadingFavorite,
  selectFavoriteError,
  selectFavoriteFoodCount,
  selectIsFoodFavorited,
} from '../slices/favorite/selectors';

// Follow selectors
export {
  selectFollowState,
  selectUserFollowInfo,
  selectIsFollowing,
  selectFollowers,
  selectFollowing,
  selectFollowerCount,
  selectFollowingCount,
  selectFollowLoading,
  selectFollowError,
} from '../slices/follow/selectors';

// Notification selectors
export {
  selectNotificationState,
  selectNotificationList,
  selectIsLoadingNotification,
  selectNotificationError,
  selectUnreadNotificationCount,
  selectHasUnreadNotifications,
} from '../slices/notification/selectors';

// ChatHistory selectors
export {
  selectChatHistoryState,
  selectConversations,
  selectCurrentConversation,
  selectIsLoadingChat,
  selectIsLoadingConversations,
  selectChatError,
  selectChatPage,
  selectChatTotalCount,
  selectChatHasMore,
  selectCurrentConversationMessages,
  selectConversationById,
} from '../slices/chatHistory/selectors';
