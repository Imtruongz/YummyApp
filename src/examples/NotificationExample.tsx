import React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { useNotification } from '../contexts/NotificationContext';

interface NotificationExampleProps {
  // Props if needed
}

const NotificationExample: React.FC<NotificationExampleProps> = () => {
  const { showNotification } = useNotification();

  const showSuccessNotification = () => {
    showNotification({
      title: 'Thành công',
      message: 'Dữ liệu đã được lưu thành công!',
      type: 'success',
    });
  };

  const showErrorNotification = () => {
    showNotification({
      title: 'Lỗi',
      message: 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.',
      type: 'error',
      duration: 0, // Không tự động đóng
      actionText: 'Thử lại',
      onAction: () => console.log('Người dùng thử lại'),
    });
  };

  const showWarningNotification = () => {
    showNotification({
      title: 'Cảnh báo',
      message: 'Bạn chưa lưu thay đổi. Tất cả thay đổi sẽ bị mất.',
      type: 'warning',
      actionText: 'Lưu ngay',
      onAction: () => console.log('Người dùng lưu thay đổi'),
    });
  };

  const showInfoNotification = () => {
    showNotification({
      title: 'Thông tin',
      message: 'Bạn có tin nhắn mới từ hệ thống.',
      type: 'info',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Thông báo thành công" onPress={showSuccessNotification} />
      </View>
      
      <View style={styles.buttonContainer}>
        <Button title="Thông báo lỗi" onPress={showErrorNotification} />
      </View>
      
      <View style={styles.buttonContainer}>
        <Button title="Thông báo cảnh báo" onPress={showWarningNotification} />
      </View>
      
      <View style={styles.buttonContainer}>
        <Button title="Thông báo thông tin" onPress={showInfoNotification} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  buttonContainer: {
    marginVertical: 8,
    width: '100%',
  },
});

export default NotificationExample;