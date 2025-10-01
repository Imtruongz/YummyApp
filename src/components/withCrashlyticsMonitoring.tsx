import React, { ComponentType, useEffect } from 'react';
import { getCrashlytics, log, recordError, setAttributes } from '@react-native-firebase/crashlytics/lib/modular';

/**
 * HOC (Higher Order Component) để tự động monitor và log các hoạt động của component
 * vào Firebase Crashlytics
 * 
 * @param WrappedComponent Component gốc cần monitor
 * @param componentName Tên custom cho component (tùy chọn)
 */
export function withCrashlyticsMonitoring<P extends object>(
  WrappedComponent: ComponentType<P>,
  componentName?: string
) {
  // Lấy tên hiển thị của component hoặc tên được chỉ định
  const displayName = componentName || WrappedComponent.displayName || WrappedComponent.name || 'UnknownComponent';
  
  // Component mới với Crashlytics monitoring
  const WithCrashlyticsMonitoring = (props: P) => {
    useEffect(() => {
      // Log khi component mount
      log(getCrashlytics(), `COMPONENT_MOUNT: ${displayName}`);
      
      return () => {
        // Log khi component unmount
        log(getCrashlytics(), `COMPONENT_UNMOUNT: ${displayName}`);
      };
    }, []);
    
    // HOC để bắt lỗi và ghi lại thông tin props khi component render
    try {
      return <WrappedComponent {...props} />;
    } catch (error) {
      // Ghi lại lỗi trong quá trình render
      const crashlyticsInstance = getCrashlytics();
      recordError(crashlyticsInstance, error as Error);
      setAttributes(crashlyticsInstance, {
        component_name: displayName,
        error_boundary: 'true',
        timestamp: new Date().toISOString()
      });
      
      // Tái ném lỗi để ErrorBoundary bắt
      throw error;
    }
  };
  
  // Đặt tên hiển thị cho HOC
  WithCrashlyticsMonitoring.displayName = `WithCrashlyticsMonitoring(${displayName})`;
  
  return WithCrashlyticsMonitoring;
}

/**
 * Ví dụ sử dụng HOC:
 * 
 * // Component gốc
 * const MyComponent = (props) => {
 *   return <View>...</View>;
 * };
 * 
 * // Component đã được wrap với Crashlytics monitoring
 * export default withCrashlyticsMonitoring(MyComponent, 'MyCustomName');
 */ 