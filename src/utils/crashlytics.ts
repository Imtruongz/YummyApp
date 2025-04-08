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
 * Buộc gửi tất cả các logs và errors hiện có lên Firebase
 * Hữu ích khi cần đảm bảo logs được gửi đi ngay lập tức mà không cần đợi sự kiện crash
 */
export const forceFlushReports = async (): Promise<void> => {
  try {
    // Ghi một log để đánh dấu khi nào việc flush được thực hiện
    await crashlytics().log('Manually flushing reports to Firebase');
    
    // Một số thiết bị cần một Non-Fatal error để trigger việc gửi logs
    const tempError = new Error('Force flush logs trigger');
    await crashlytics().recordError(tempError);
    
    // Hiện tại không có API trực tiếp để flush reports trong React Native Firebase
    // Nhưng việc ghi log + recordError thường sẽ kích hoạt việc gửi logs
    console.log('Reports flushed to Firebase');
  } catch (error) {
    console.error('Failed to flush reports:', error);
  }
};

/**
 * Ghi lại lỗi trong Crashlytics và thêm thuộc tính tùy chỉnh
 * @param error - Đối tượng lỗi cần ghi lại
 * @param attributes - Đối tượng chứa các thuộc tính tùy chỉnh
 * @param shouldFlush - Có nên force flush report ngay lập tức không (mặc định: true)
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
  
  // Buộc gửi logs ngay lập tức nếu được yêu cầu
  if (shouldFlush) {
    await forceFlushReports();
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
 * @param shouldFlush - Có nên force flush report ngay lập tức không (mặc định: true)
 */
export const logFailure = async (name: string, reason: string, shouldFlush: boolean = true) => {
  await crashlytics().setAttributes({
    [`failure_${name}`]: reason,
    timestamp: new Date().toISOString()
  });

  // Ghi thêm một non-fatal error để đảm bảo logs được gửi đi
  await crashlytics().recordError(new Error(`Failure: ${name} - ${reason}`));
  
  // Buộc gửi logs ngay lập tức nếu được yêu cầu
  if (shouldFlush) {
    await forceFlushReports();
  }
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
      
      // Force flush logs cho các lỗi nghiêm trọng
      if (isFatal) {
        forceFlushReports();
      }

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
      
      // Force flush logs ngay lập tức cho promise rejections
      forceFlushReports();
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
      
      // Force flush logs ngay lập tức cho uncaught exceptions
      forceFlushReports();
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
        crashlytics().log(`REQUEST_PARAMS: ${JSON.stringify(config.params)}`);
      }
      if (config.data) {
        crashlytics().log(`REQUEST_BODY: ${JSON.stringify(config.data)}`);
      }
      return config;
    },
    (error: any) => {
      logError(error, {
        error_type: 'axios_request',
        timestamp: new Date().toISOString(),
        request_params: error.config?.params ? JSON.stringify(error.config.params) : 'none',
        request_body: error.config?.data ? JSON.stringify(error.config.data) : 'none'
      });
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response: any) => {
      // Ghi log response data
      crashlytics().log(`API_RESPONSE: ${response.config.method.toUpperCase()} ${response.config.url} - ${response.status}`);
      if (response.data) {
        crashlytics().log(`RESPONSE_DATA: ${JSON.stringify(response.data)}`);
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
        request_params: config?.params ? JSON.stringify(config.params) : 'none',
        request_body: config?.data ? JSON.stringify(config.data) : 'none',
        response_data: response?.data ? JSON.stringify(response.data) : 'none'
      });
      
      return Promise.reject(error);
    }
  );
}; 