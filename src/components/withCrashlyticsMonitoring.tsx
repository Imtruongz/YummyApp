import React, { ComponentType, useEffect } from 'react';
import crashlytics from '@react-native-firebase/crashlytics';

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
      crashlytics().log(`COMPONENT_MOUNT: ${displayName}`);
      
      return () => {
        // Log khi component unmount
        crashlytics().log(`COMPONENT_UNMOUNT: ${displayName}`);
      };
    }, []);
    
    // HOC để bắt lỗi và ghi lại thông tin props khi component render
    try {
      return <WrappedComponent {...props} />;
    } catch (error) {
      // Ghi lại lỗi trong quá trình render
      crashlytics().recordError(error as Error);
      crashlytics().setAttributes({
        error_component: displayName,
        error_stage: 'render',
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