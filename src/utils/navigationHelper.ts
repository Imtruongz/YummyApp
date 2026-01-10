import { createNavigationContainerRef, CommonActions, StackActions } from '@react-navigation/native';
import { RootStackParamList, AuthStackParamList, MainStackParamList, HomeStack } from '../navigation/types';

// Tạo navigation ref
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

// Helper cơ bản
export function navigate(name: keyof RootStackParamList | keyof AuthStackParamList | keyof MainStackParamList | keyof HomeStack, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name as any, params);
  }
}

export function goBack() {
  if (navigationRef.isReady()) {
    navigationRef.goBack();
  }
}

export function resetTo(routeName: string, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: routeName, params }],
      })
    );
  }
}

// Replace current route in the active navigator
export function replace(name: string, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.replace(name as any, params));
  }
}

// Helpers cụ thể cho các screen
export function navigateToHome() {
  resetTo('HomeNavigator');
}

export function navigateToSearch() {
  navigate('SearchScreen');
}

export function navigateToNewFood() {
  navigate('NewFoodScreen');
}

export function navigateToProfile(userId?: string) {
  navigate('ProfileNavigator', userId ? { userId } : undefined);
}

export function navigateToSettings() {
  navigate('SettingNavigator');
}

export function navigateToFoodDetail(foodId: string, userId: string) {
  if (navigationRef.isReady()) {
    navigationRef.navigate('HomeNavigator' as any, {
      screen: 'FoodDetailScreen',
      params: { foodId, userId },
    });
  }
}

export function navigateToCategories(categoryId?: string) {
  if (navigationRef.isReady()) {
    navigationRef.navigate('HomeNavigator' as any, {
      screen: 'CategoriesScreen',
      params: categoryId ? { categoryId } : undefined,
    });
  }
}

export function navigateToListFoodByUser(userId: string) {
  navigate('ListFoodByUserPage', { userId });
}

export function navigateToNotifications() {
  navigate('NotificationsScreen');
}

export function navigateToPayment(userId: string, amount?: number, phoneNumber?: string, serviceType?: string, serviceProvider?: string) {
  navigate('PaymentScreen', { userId, amount, phoneNumber, serviceType, serviceProvider });
}

export function navigateToPaymentSuccess() {
  navigate('PaymentSuccessScreen');
}

export function navigateToYummyAI() {
  navigate('YummyAIScreen');
}

export function navigateToChatHistory() {
  navigate('ChatHistory');
}

export function navigateToLogin() {
  navigate('Auth');
}

export function navigateToSignUp() {
  navigate('SignUpPage');
}

export function navigateToForgotPassword() {
  navigate('ForgotPasswordPage');
}