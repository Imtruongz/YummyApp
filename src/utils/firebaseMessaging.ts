import messaging from '@react-native-firebase/messaging';
import { Alert, Platform } from 'react-native';

/**
 * Khởi tạo FCM: xin quyền, lấy token, lắng nghe thông báo foreground
 * @param onToken callback nhận FCM token (có thể dùng để gửi lên server)
 * @param onMessage callback khi nhận được notification foreground
 */
export const initFirebaseMessaging = async (
  onToken?: (token: string) => void,
  onMessage?: (remoteMessage: any) => void
) => {
  // Xin quyền nhận thông báo
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
  // Lấy FCM token
  const fcmToken = await messaging().getToken();
  console.log('[FCM] Token lấy từ Firebase:', fcmToken);
  if (onToken) onToken(fcmToken);
  } else {
    Alert.alert('Thông báo', 'Bạn chưa cho phép nhận thông báo!');
  }

  // Lắng nghe khi app đang foreground
  const unsubscribe = messaging().onMessage(async remoteMessage => {
    if (onMessage) onMessage(remoteMessage);
  });

  // Lắng nghe khi token thay đổi
  const unsubscribeToken = messaging().onTokenRefresh(token => {
    if (onToken) onToken(token);
  });

  return () => {
    unsubscribe();
    unsubscribeToken();
  };
};

// Hàm tiện ích lấy token (nếu cần dùng riêng)
export const getFcmToken = async () => {
  return await messaging().getToken();
};
