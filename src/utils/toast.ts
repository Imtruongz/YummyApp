/**
 * Toast Notification Helper
 * Centralized notification management for the entire app
 * 
 * Impact: 26 occurrences -> 1 pattern
 * Reduces code by ~50 lines
 */

import Toast from 'react-native-toast-message';

const TOAST_DURATION = 2000;

export const showToast = {
  /**
   * Show success toast message (Green)
   * title - Main title (shown in bold)
   * message - Additional message (optional)
   * 
   * Usage: showToast.success('Thành công', 'Dữ liệu đã được lưu');
   */
  success: (title: string, message?: string) => {
    Toast.show({
      type: 'success',
      text1: title,
      text2: message,
      visibilityTime: TOAST_DURATION,
    });
  },

  /**
   * Show error toast message (Red)
   * title - Main title (shown in bold)
   * message - Additional message (optional)
   * 
   * Usage: showToast.error('Lỗi', 'Không thể kết nối server');
   */
  error: (title: string, message?: string) => {
    Toast.show({
      type: 'error',
      text1: title,
      text2: message,
      visibilityTime: TOAST_DURATION,
    });
  },

  /**
   * Show info toast message (Blue)
   * title - Main title (shown in bold)
   * message - Additional message (optional)
   * 
   * Usage: showToast.info('Thông báo', 'Bạn có tin nhắn mới');
   */
  info: (title: string, message?: string) => {
    Toast.show({
      type: 'info',
      text1: title,
      text2: message,
      visibilityTime: TOAST_DURATION,
    });
  },

  /**
   * Show warning toast message (Yellow)
   * title - Main title (shown in bold)
   * message - Additional message (optional)
   * 
   * Usage: showToast.warning('Cảnh báo', 'Thao tác này không thể hoàn tác');
   */
  warning: (title: string, message?: string) => {
    Toast.show({
      type: 'warning',
      text1: title,
      text2: message,
      visibilityTime: TOAST_DURATION,
    });
  },

  /**
   * Show custom toast message with full control
   * title - Main title
   * message - Additional message
   * type - Toast type: 'success' | 'error' | 'info' | 'warning'
   * duration - Visibility duration in ms (default: 2000)
   * 
   * Usage: showToast.custom('Quan trọng', 'Vui lòng chú ý', 'warning', 5000);
   */
  custom: (
    title: string,
    message?: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info',
    duration = TOAST_DURATION
  ) => {
    Toast.show({
      type,
      text1: title,
      text2: message,
      visibilityTime: duration,
    });
  },
};
