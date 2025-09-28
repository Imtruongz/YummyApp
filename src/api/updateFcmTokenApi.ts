import axios from 'axios';

/**
 * Gửi FCM token lên server cho user hiện tại
 * @param {string} fcmToken - Token FCM lấy từ Firebase
 * @param {string} accessToken - Token xác thực của user (Bearer)
 * @returns {Promise<void>}
 */
export const updateFcmTokenApi = async (fcmToken: string, accessToken: string) => {
  console.log('[FCM] accessToken gửi lên server2:', accessToken);
  await axios.patch(
    '/api/users/update-fcm-token',
    { fcmToken },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};
