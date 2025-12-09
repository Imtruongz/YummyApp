import api from './config';

/**
 * Gửi FCM token lên server cho user hiện tại
 * @param {string} fcmToken - Token FCM lấy từ Firebase
 * @param {string} accessToken - Token xác thực của user (Bearer)
 * @returns {Promise<void>}
 */
export const updateFcmTokenApi = async (fcmToken: string, accessToken: string) => {
  try {
    const response = await api.patch(
      '/users/update-fcm-token',
      { fcmToken },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.log('❌ [FCM API] Lỗi khi cập nhật FCM token:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
    });
    throw error;
  }
};
