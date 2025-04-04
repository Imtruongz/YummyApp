/**
 * Ví dụ sử dụng Crashlytics trong React Native
 * 
 * File này chứa các ví dụ thực tế về cách sử dụng Firebase Crashlytics
 */

import crashlytics from '@react-native-firebase/crashlytics';
import { logError, setUserIdentifier, logUserAction } from './crashlytics';

/**
 * Ví dụ 1: Xử lý lỗi trong API call
 */
export const apiCallExample = async () => {
  try {
    // Giả lập gọi API
    const response = await fetch('https://api.example.com/data');
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    // Ghi lại lỗi với thông tin chi tiết về API call
    await logError(error, {
      api_endpoint: 'https://api.example.com/data',
      http_method: 'GET',
      timestamp: new Date().toISOString()
    });
    
    // Ném lại lỗi để component xử lý
    throw error;
  }
};

/**
 * Ví dụ 2: Xử lý lỗi trong quá trình xác thực
 */
export const authErrorExample = async (username: string, password: string) => {
  try {
    // Ghi lại hành động đăng nhập
    await logUserAction('login_attempt', `user: ${username}`);
    
    // Giả lập quá trình xác thực
    if (password.length < 8) {
      throw new Error('Password too short');
    }

    // Giả định đăng nhập thành công
    // Cập nhật userId cho Crashlytics
    await setUserIdentifier('user123', username, 'User Display Name');
    
    // Ghi lại hành động đăng nhập thành công
    await logUserAction('login_success');
    
    return { success: true, userId: 'user123' };
  } catch (error) {
    // Ghi lại lỗi đăng nhập
    await logError(error, {
      error_type: 'auth_error',
      username_length: String(username.length),
      password_length: String(password.length)
    });
    
    return { success: false, error: (error as Error).message };
  }
};

/**
 * Ví dụ 3: Theo dõi hiệu suất ứng dụng
 */
export const trackPerformance = async (operationName: string) => {
  const startTime = Date.now();
  
  try {
    // Ghi log bắt đầu thực hiện
    await crashlytics().log(`START_OPERATION: ${operationName}`);
    
    // Giả lập một tác vụ nặng
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Tính thời gian hoàn thành
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Ghi log thông tin hiệu suất
    await crashlytics().setAttributes({
      [`duration_${operationName}`]: String(duration),
      [`completed_${operationName}`]: 'true'
    });
    
    return { success: true, duration };
  } catch (error) {
    // Ghi lại lỗi trong quá trình thực hiện
    await logError(error, {
      operation: operationName,
      duration_before_error: String(Date.now() - startTime)
    });
    
    return { success: false, error: (error as Error).message };
  }
};

/**
 * Ví dụ 4: Tạo tùy chỉnh non-fatal exception
 */
export const reportNonFatalIssue = (componentName: string, issueDescription: string) => {
  // Tạo một lỗi không gây crash nhưng vẫn được báo cáo
  const customError = new Error(`Issue in ${componentName}: ${issueDescription}`);
  
  // Ghi lại lỗi non-fatal với tags
  crashlytics().recordError(customError);
  crashlytics().setAttributes({
    component: componentName,
    issue_type: 'non_fatal',
    description: issueDescription
  });
  
  console.warn(`Reported non-fatal issue: ${issueDescription}`);
};

/**
 * Ví dụ 5: Theo dõi dữ liệu không hợp lệ
 */
export const validateAndProcessData = (data: any) => {
  try {
    // Kiểm tra dữ liệu
    if (!data) {
      throw new Error('Data is null or undefined');
    }
    
    if (!data.id) {
      // Ghi lại vấn đề về dữ liệu mà không cần ném lỗi
      crashlytics().log('Data validation issue: missing ID');
      crashlytics().setAttributes({
        data_issue: 'missing_id',
        data_received: JSON.stringify(data).substring(0, 100) // Giới hạn độ dài
      });
      
      // Xử lý dữ liệu không hợp lệ
      return { valid: false, reason: 'missing_id' };
    }
    
    // Xử lý dữ liệu hợp lệ
    return { valid: true, processedId: data.id };
  } catch (error) {
    // Ghi lại lỗi lớn hơn
    logError(error, {
      data_type: typeof data,
      validation_step: 'initial_check'
    });
    
    return { valid: false, reason: 'exception' };
  }
}; 