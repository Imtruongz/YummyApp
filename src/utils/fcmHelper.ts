import messaging from '@react-native-firebase/messaging';
import { updateFcmTokenApi } from '@/api/updateFcmTokenApi';

/**
 * Lấy FCM token và update lên server
 * Simplified version cho iOS (remove registerDeviceForRemoteMessages vì deprecated)
 */
export const getFCMTokenAndUpdate = async (accessToken: string) => {
  try {
    console.log('🔔 [FCM] Bắt đầu lấy FCM token...');
    
    // Request permission
    const authStatus = await messaging().requestPermission();
    console.log('✅ [FCM] Permission status:', authStatus);
    
    // Đợi một chút
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Lấy token
    const fcmToken = await messaging().getToken();
    console.log('✅ [FCM] Token lấy được:', fcmToken?.substring(0, 30) + '...');
    
    if (!fcmToken) {
      console.warn('⚠️ [FCM] Token rỗng!');
      return null;
    }
    
    // Gửi lên server
    console.log('🔔 [FCM] Cập nhật token lên server...');
    await updateFcmTokenApi(fcmToken, accessToken);
    console.log('✅ [FCM] Cập nhật thành công!');
    
    return fcmToken;
  } catch (err) {
    console.log('❌ [FCM] Lỗi:', err);
    return null;
  }
};
