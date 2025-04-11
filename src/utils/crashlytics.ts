import crashlytics from '@react-native-firebase/crashlytics';

// Khai báo interface để TypeScript hiểu được global
declare global {
  interface Global {
    ErrorUtils: {
      setGlobalHandler: (callback: (error: Error, isFatal?: boolean) => void) => void;
    };
  }
}

/**
 * Mask các thông tin nhạy cảm trong data
 * @param data - Dữ liệu cần mask
 * @returns Dữ liệu đã được mask
 */
const maskSensitiveData = (data: any): any => {
  if (!data) return data;
  
  // Danh sách các key chứa thông tin nhạy cảm
  const sensitiveKeys = [
    'password',
    'token',
    'access_token',
    'refresh_token',
    'authorization',
    'api_key',
    'secret',
    'credit_card',
    'card_number',
    'cvv',
    'pin',
    'ssn',
    'social_security',
    'phone',
    'email'
  ];

  // Nếu data là string, kiểm tra xem có chứa thông tin nhạy cảm không
  if (typeof data === 'string') {
    // Mask các token thường gặp
    return data.replace(/(Bearer\s+)[^\s]+/g, '$1[REDACTED]')
               .replace(/(token=)[^&]+/g, '$1[REDACTED]')
               .replace(/(password=)[^&]+/g, '$1[REDACTED]');
  }

  // Nếu data là object, mask các key nhạy cảm
  if (typeof data === 'object') {
    const maskedData = { ...data };
    for (const key in maskedData) {
      if (sensitiveKeys.some(sensitiveKey => 
        key.toLowerCase().includes(sensitiveKey.toLowerCase())
      )) {
        maskedData[key] = '[REDACTED]';
      } else if (typeof maskedData[key] === 'object') {
        maskedData[key] = maskSensitiveData(maskedData[key]);
      }
    }
    return maskedData;
  }

  return data;
};

/**
 * Ghi lại lỗi trong Crashlytics và thêm thuộc tính tùy chỉnh
 * @param error - Đối tượng lỗi cần ghi lại
 * @param attributes - Đối tượng chứa các thuộc tính tùy chỉnh
 */
export const logError = async (error: any, attributes?: Record<string, string>, shouldFlush: boolean = true) => {
  if (attributes) {
    await crashlytics().setAttributes(attributes);
  }
  
  if (error instanceof Error) {
    await crashlytics().recordError(error);
  } else {
    await crashlytics().recordError(new Error(String(error)));
  }
 
};

/**
 * Cập nhật thông tin người dùng trong Crashlytics khi họ đăng nhập
 * @param userId - ID của người dùng
 * @param email - Email của người dùng (tùy chọn)
 * @param username - Tên người dùng (tùy chọn)
 */
export const setUserIdentifier = async (userId: string, email?: string, username?: string) => {
  await crashlytics().setUserId(userId);
  
  const attributes: Record<string, string> = {};
  if (email) attributes.email = email;
  if (username) attributes.username = username;
  
  if (Object.keys(attributes).length > 0) {
    await crashlytics().setAttributes(attributes);
  }
};

/**
 * Đặt trạng thái thu thập dữ liệu Crashlytics
 * @param enabled - Bật hoặc tắt thu thập dữ liệu
 */
export const setCrashlyticsEnabled = async (enabled: boolean): Promise<boolean> => {
  await crashlytics().setCrashlyticsCollectionEnabled(enabled);
  return crashlytics().isCrashlyticsCollectionEnabled;
};

/**
 * Ghi lại xử lý không thành công
 * @param name - Tên xử lý
 * @param reason - Lý do không thành công
 */
export const logFailure = async (name: string, reason: string) => {
  await crashlytics().setAttributes({
    [`failure_${name}`]: reason,
    timestamp: new Date().toISOString()
  });

  // Ghi thêm một non-fatal error để đảm bảo logs được gửi đi
  await crashlytics().recordError(new Error(`Failure: ${name} - ${reason}`));
};

/**
 * Ghi lại hành động của người dùng
 * @param action - Tên hành động
 * @param details - Chi tiết về hành động
 */
export const logUserAction = async (action: string, details?: string) => {
  await crashlytics().log(`USER_ACTION: ${action}${details ? ` - ${details}` : ''}`);
};

/**
 * Thiết lập global error handler cho toàn bộ ứng dụng
 * Gọi hàm này trong file App.tsx
 */
export const setupGlobalErrorHandler = () => {
  // Xử lý lỗi không bắt được trong JS
  const errorHandler = (error: Error, isFatal?: boolean) => {
    try {
      // Ghi lại lỗi nhưng không hiển thị trực tiếp
      crashlytics().recordError(error);
      crashlytics().setAttributes({
        isFatal: String(isFatal || false),
        timestamp: new Date().toISOString(),
        error_source: 'global_error_handler'
      });

      // Log lỗi vào console thay vì hiển thị trực tiếp
      console.log('Global error caught:', error.message);
    } catch (handlerError) {
      // Tránh vòng lặp vô hạn nếu có lỗi trong error handler
      console.error('Error in error handler:', handlerError);
    }
  };

  // Override hàm console.error để log các lỗi
  const originalConsoleError = console.error;
  console.error = (...args: any[]) => {
    // Gọi hàm console.error gốc
    originalConsoleError(...args);
    
    // Log lỗi vào Crashlytics
    const errorMessage = args.map(arg => 
      typeof arg === 'string' ? arg : JSON.stringify(arg)
    ).join(' ');
    
    crashlytics().log(`CONSOLE_ERROR: ${errorMessage}`);
  };

  // Cấu hình các xử lý lỗi khác nhau cho ứng dụng
  const globalAny = global as any;
  if (globalAny.ErrorUtils) {
    globalAny.ErrorUtils.setGlobalHandler(errorHandler);
  }

  // Xử lý unhandled promise rejections
  if (typeof process !== 'undefined' && process.on) {
    process.on('unhandledRejection', (reason) => {
      let error;
      if (reason instanceof Error) {
        error = reason;
      } else {
        error = new Error(`Unhandled Promise Rejection: ${reason}`);
      }
      crashlytics().recordError(error);
      crashlytics().setAttributes({
        error_source: 'unhandled_promise_rejection',
        timestamp: new Date().toISOString()
      });
    });
  }

  // Xử lý uncaught exceptions
  if (typeof process !== 'undefined' && process.on) {
    process.on('uncaughtException', (error) => {
      crashlytics().recordError(error);
      crashlytics().setAttributes({
        error_source: 'uncaught_exception',
        timestamp: new Date().toISOString()
      });
    });
  }
};

/**
 * Thiết lập interceptor cho tất cả API calls sử dụng Axios
 * @param axiosInstance - Instance của Axios được sử dụng trong ứng dụng
 */
export const setupAxiosInterceptor = (axiosInstance: any) => {
  axiosInstance.interceptors.request.use(
    (config: any) => {
      // Ghi log request params
      crashlytics().log(`API_REQUEST: ${config.method.toUpperCase()} ${config.url}`);
      if (config.params) {
        const maskedParams = maskSensitiveData(config.params);
        crashlytics().log(`REQUEST_PARAMS: ${JSON.stringify(maskedParams)}`);
      }
      if (config.data) {
        const maskedData = maskSensitiveData(config.data);
        crashlytics().log(`REQUEST_BODY: ${JSON.stringify(maskedData)}`);
      }
      return config;
    },
    (error: any) => {
      logError(error, {
        error_type: 'axios_request',
        timestamp: new Date().toISOString(),
        request_params: error.config?.params ? JSON.stringify(maskSensitiveData(error.config.params)) : 'none',
        request_body: error.config?.data ? JSON.stringify(maskSensitiveData(error.config.data)) : 'none'
      });
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response: any) => {
      // Ghi log response data
      crashlytics().log(`API_RESPONSE: ${response.config.method.toUpperCase()} ${response.config.url} - ${response.status}`);
      if (response.data) {
        const maskedData = maskSensitiveData(response.data);
        crashlytics().log(`RESPONSE_DATA: ${JSON.stringify(maskedData)}`);
      }
      return response;
    },
    (error: any) => {
      const { config, response } = error;
      
      logError(error, {
        error_type: 'axios_response',
        url: config?.url || 'unknown',
        method: config?.method || 'unknown',
        status: response?.status ? String(response.status) : 'unknown',
        timestamp: new Date().toISOString(),
        request_params: config?.params ? JSON.stringify(maskSensitiveData(config.params)) : 'none',
        request_body: config?.data ? JSON.stringify(maskSensitiveData(config.data)) : 'none',
        response_data: response?.data ? JSON.stringify(maskSensitiveData(response.data)) : 'none'
      });
      
      return Promise.reject(error);
    }
  );
}; 