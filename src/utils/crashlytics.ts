import { 
  getCrashlytics, 
  log as crashlyticsLog,
  recordError as crashlyticsRecordError,
  setAttribute as crashlyticsSetAttribute,
  setAttributes as crashlyticsSetAttributes,
  setCrashlyticsCollectionEnabled as crashlyticsSetCrashlyticsCollectionEnabled,
  setUserId as crashlyticsSetUserId
} from '@react-native-firebase/crashlytics/lib/modular';

// Import axios để setup interceptors
import axios from 'axios';

/**
 * Utility để mask các dữ liệu nhạy cảm trước khi gửi lên Crashlytics
 */
const maskSensitiveData = (data: any): any => {
  if (!data || typeof data !== 'object') return data;
  
  const maskedData = { ...data };
  const sensitiveFields = ['password', 'token', 'accessToken', 'refreshToken', 'secret', 'key', 'authorization'];
  
  Object.keys(maskedData).forEach(key => {
    if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
      maskedData[key] = '***MASKED***';
    }
  });
  
  return maskedData;
};

/**
 * Ghi lại lỗi với context và gửi lên Crashlytics
 * @param error - Error object cần ghi lại
 * @param context - Context hoặc mô tả thêm về lỗi
 */
export const logError = (error: Error, context?: string): void => {
  try {
    const crashlyticsInstance = getCrashlytics();
    // Ghi lại lỗi trước khi gửi lên Crashlytics
    const errorMessage = `${context ? `[${context}] ` : ''}${error.name}: ${error.message}`;
    
    console.error(errorMessage, error.stack);
    
    // Gửi lỗi lên Crashlytics sử dụng modular API
    crashlyticsRecordError(crashlyticsInstance, error);
    crashlyticsSetAttributes(crashlyticsInstance, {
      error_context: context || 'unknown',
      error_name: error.name,
      timestamp: new Date().toISOString()
    });
  } catch (crashlyticsError) {
    // Nếu Crashlytics fail, vẫn log lỗi gốc ra console
    console.error('Failed to log to Crashlytics:', crashlyticsError);
    console.error('Original error:', error);
  }
};

/**
 * Ghi log message với level khác nhau
 * @param message - Nội dung message
 * @param level - Level của log (info, warning, error)
 */
export const logMessage = (message: string, level: 'info' | 'warning' | 'error' = 'info'): void => {
  try {
    const crashlyticsInstance = getCrashlytics();
    const logMessage = `[${level.toUpperCase()}] ${message}`;
    
    // Log local trước
    if (level === 'error') {
      console.error(logMessage);
    } else if (level === 'warning') {
      console.warn(logMessage);
    } else {
      console.log(logMessage);
    }
    
    // Gửi log lên Crashlytics sử dụng modular API
    crashlyticsLog(crashlyticsInstance, logMessage);
    crashlyticsSetAttributes(crashlyticsInstance, {
      log_level: level,
      timestamp: new Date().toISOString()
    });
  } catch (crashlyticsError) {
    console.error('Failed to log message to Crashlytics:', crashlyticsError);
  }
};

/**
 * Đặt user context cho Crashlytics
 * @param userId - ID của user
 * @param additionalAttributes - Các attributes bổ sung
 */
export const setUserContext = (userId: string, additionalAttributes?: Record<string, string>): void => {
  try {
    const crashlyticsInstance = getCrashlytics();
    // Đặt user ID sử dụng modular API
    crashlyticsSetUserId(crashlyticsInstance, userId);
    
    // Đặt các attributes bổ sung
    if (additionalAttributes) {
      crashlyticsSetAttributes(crashlyticsInstance, additionalAttributes);
    }
    
    crashlyticsSetAttributes(crashlyticsInstance, {
      user_context_updated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to set user context in Crashlytics:', error);
  }
};

/**
 * Bật/tắt Crashlytics collection
 * @param enabled - true để bật, false để tắt
 */
export const setCrashlyticsEnabled = async (enabled: boolean): Promise<boolean> => {
  const crashlyticsInstance = getCrashlytics();
  
  await crashlyticsSetCrashlyticsCollectionEnabled(crashlyticsInstance, enabled);
  return crashlyticsInstance.isCrashlyticsCollectionEnabled;
};

/**
 * Ghi lại xử lý không thành công
 * @param name - Tên xử lý
 * @param reason - Lý do không thành công
 */
export const logFailure = async (name: string, reason: string) => {
  const crashlyticsInstance = getCrashlytics();
  
  await crashlyticsSetAttributes(crashlyticsInstance, {
    [`failure_${name}`]: reason,
    timestamp: new Date().toISOString()
  });

  // Ghi thêm một non-fatal error để đảm bảo logs được gửi đi
  const error = new Error(`Operation failed: ${name} - ${reason}`);
  error.name = 'OperationFailure';
  crashlyticsRecordError(crashlyticsInstance, error);
};

/**
 * Setup global error handler để tự động ghi lại các lỗi không được handle
 */
export const setupGlobalErrorHandler = (): void => {
  // Setup cho React Native ErrorUtils
  if (typeof globalThis !== 'undefined' && (globalThis as any).ErrorUtils) {
    const errorUtils = (globalThis as any).ErrorUtils;
    const originalHandler = errorUtils.getGlobalHandler && errorUtils.getGlobalHandler();
    
    errorUtils.setGlobalHandler((error: Error, isFatal?: boolean) => {
      logError(error, `Global Error Handler (Fatal: ${isFatal})`);
      
      // Gửi lên Crashlytics với thông tin chi tiết
      try {
        const crashlyticsInstance = getCrashlytics();
        // Ghi lại lỗi nhưng không hiển thị trực tiếp sử dụng modular API
        crashlyticsRecordError(crashlyticsInstance, error);
        crashlyticsSetAttributes(crashlyticsInstance, {
          isFatal: String(isFatal || false),
          timestamp: new Date().toISOString(),
          error_source: 'global_error_handler'
        });
      } catch (crashlyticsError) {
        console.error('Failed to log global error to Crashlytics:', crashlyticsError);
      }
      
      // Chạy handler gốc nếu có
      if (originalHandler) {
        originalHandler(error, isFatal);
      }
    });
  }

  // Override console.error để tự động log (chỉ log những lỗi quan trọng)
  if (typeof console !== 'undefined') {
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      // Gọi console.error gốc trước
      originalConsoleError.apply(console, args);
      
      // Filter ra những warning/error không quan trọng
      const errorMessage = args.map(arg => 
        typeof arg === 'string' ? arg : JSON.stringify(arg)
      ).join(' ');
      
      // Chỉ log lên Crashlytics nếu không phải là network error hoặc warning thông thường
      const shouldSkip = errorMessage.includes('Network Error') || 
                        errorMessage.includes('Warning:') ||
                        errorMessage.includes('[Axios Response Error]') ||
                        errorMessage.includes('[Axios Request Error]') ||
                        errorMessage.includes('AxiosError') ||
                        errorMessage.includes('timeout') ||
                        errorMessage.includes('ECONNREFUSED') ||
                        errorMessage.includes('Request failed');
      
      if (!shouldSkip) {
        crashlyticsLog(getCrashlytics(), `CONSOLE_ERROR: ${errorMessage}`);
      }
    };
  }
  
  // Setup unhandled promise rejection handler
  if (typeof process !== 'undefined' && process.on) {
    process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
      const error = reason instanceof Error ? reason : new Error(String(reason));
      logError(error, 'Unhandled Promise Rejection');
      
      try {
        const crashlyticsInstance = getCrashlytics();
        crashlyticsRecordError(crashlyticsInstance, error);
        crashlyticsSetAttributes(crashlyticsInstance, {
          error_source: 'unhandled_promise_rejection',
          timestamp: new Date().toISOString()
        });
      } catch (crashlyticsError) {
        console.error('Failed to log unhandled rejection to Crashlytics:', crashlyticsError);
      }
    });

    process.on('uncaughtException', (error: Error) => {
      logError(error, 'Uncaught Exception');
      
      try {
        const crashlyticsInstance = getCrashlytics();
        crashlyticsRecordError(crashlyticsInstance, error);
        crashlyticsSetAttributes(crashlyticsInstance, {
          error_source: 'uncaught_exception',
          timestamp: new Date().toISOString()
        });
      } catch (crashlyticsError) {
        console.error('Failed to log uncaught exception to Crashlytics:', crashlyticsError);
      }
    });
  }
};

/**
 * Setup Axios interceptors để tự động log các API errors
 */
export const setupAxiosInterceptor = (): void => {
  // Request interceptor
  axios.interceptors.request.use(
    (config) => {
      try {
        const crashlyticsInstance = getCrashlytics();
        // Ghi log request params
        crashlyticsLog(crashlyticsInstance, `API_REQUEST: ${config.method?.toUpperCase()} ${config.url}`);
        if (config.params) {
          const maskedParams = maskSensitiveData(config.params);
          crashlyticsLog(crashlyticsInstance, `REQUEST_PARAMS: ${JSON.stringify(maskedParams)}`);
        }
        if (config.data) {
          const maskedData = maskSensitiveData(config.data);
          crashlyticsLog(crashlyticsInstance, `REQUEST_BODY: ${JSON.stringify(maskedData)}`);
        }
      } catch (error) {
        console.error('Error in axios request interceptor:', error);
      }
      return config;
    },
    (error) => {
      // Chỉ log request errors nghiêm trọng, không phải network issues thông thường
      if (!__DEV__ || !error.message?.includes('Network Error')) {
        logError(error, 'Axios Request Error');
      }
      return Promise.reject(error);
    }
  );

  // Response interceptor
  axios.interceptors.response.use(
    (response) => {
      try {
        const crashlyticsInstance = getCrashlytics();
        crashlyticsLog(crashlyticsInstance, `API_RESPONSE: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
        if (response.data) {
          const maskedData = maskSensitiveData(response.data);
          crashlyticsLog(crashlyticsInstance, `RESPONSE_DATA: ${JSON.stringify(maskedData)}`);
        }
      } catch (error) {
        console.error('Error in axios response interceptor:', error);
      }
      return response;
    },
    (error) => {
      const status = error.response?.status || 'unknown';
      
      // Chỉ log lên Crashlytics nếu không phải development mode hoặc không phải network error
      const isDev = __DEV__;
      const isNetworkError = error.message?.includes('Network Error') || !error.response;
      
      if (!isDev || !isNetworkError) {
        try {
          const crashlyticsInstance = getCrashlytics();
          crashlyticsLog(crashlyticsInstance, `API_ERROR: ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${status}`);
          crashlyticsSetAttributes(crashlyticsInstance, {
            error_code: String(status),
            endpoint: error.config?.url || 'unknown',
            method: error.config?.method || 'unknown',
            timestamp: new Date().toISOString()
          });

          if (error.response?.data) {
            const maskedError = maskSensitiveData(error.response.data);
            crashlyticsLog(crashlyticsInstance, `ERROR_RESPONSE: ${JSON.stringify(maskedError)}`);
          }
        } catch (crashlyticsError) {
          console.error('Failed to log axios error to Crashlytics:', crashlyticsError);
        }

        // Log error với context chi tiết (chỉ khi không phải network error trong dev)
        logError(error, 'Axios Response Error');
      }
      
      return Promise.reject(error);
    }
  );
}; 