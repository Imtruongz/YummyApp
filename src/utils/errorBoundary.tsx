import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import color from './color';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Component ErrorBoundary bắt lỗi xảy ra trong React component tree
 * và ghi lại lỗi qua Crashlytics
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Cập nhật state để hiển thị UI fallback
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Ghi lại lỗi vào Crashlytics
    const attributes: Record<string, string> = {
      error_type: 'react_error_boundary',
      timestamp: new Date().toISOString()
    };
    
    // Thêm component stack nếu có
    if (errorInfo && errorInfo.componentStack) {
      attributes.component_stack = errorInfo.componentStack.toString();
    }
    
  }

  resetError = (): void => {
    this.setState({ hasError: false, error: null });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Nếu có fallback custom, sử dụng nó
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // UI fallback mặc định khi xảy ra lỗi
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Đã xảy ra lỗi</Text>
          <Text style={styles.message}>
            {this.state.error?.message || 'Có lỗi xảy ra trong ứng dụng.'}
          </Text>
          <TouchableOpacity style={styles.button} onPress={this.resetError}>
            <Text style={styles.buttonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.light,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: color.danger,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: color.dark,
  },
  button: {
    backgroundColor: color.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: color.light,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ErrorBoundary; 