import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  Animated,
  Dimensions,
  Platform
} from 'react-native';
import colors from '../../utils/color';

// Icons import
const IoniconsIcon = require('react-native-vector-icons/Ionicons').default;

export interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  type?: 'warning' | 'info' | 'error' | 'success';
  onClose: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  title,
  message,
  type = 'warning',
  onClose,
  onConfirm,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy'
}) => {
  const [animation] = useState(new Animated.Value(0));
  
  useEffect(() => {
    if (visible) {
      Animated.spring(animation, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      }).start();
    }
  }, [visible]);
  
  const handleClose = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true
    }).start(() => onClose());
  };
  
  const scale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1]
  });
  
  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });
  
  // Xác định màu sắc dựa trên loại thông báo
  const getBackgroundColor = () => {
    switch (type) {
      case 'success': return '#4CAF50';
      case 'error': return '#F44336';
      case 'warning': return '#FF9800';
      case 'info': default: return colors.primary;
    }
  };
  
  // Xác định icon dựa trên loại thông báo
  const getIcon = () => {
    switch (type) {
      case 'success': return 'checkmark-circle';
      case 'error': return 'close-circle';
      case 'warning': return 'warning';
      case 'info': default: return 'information-circle';
    }
  };
  
  if (!visible) return null;
  
  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={handleClose}
      animationType="none"
      statusBarTranslucent
    >
      <View style={styles.modalContainer}>
        <Animated.View 
          style={[
            styles.modalContent, 
            { 
              transform: [{ scale }],
              opacity
            }
          ]}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.title}>{title}</Text>
          </View>
          
          <View style={styles.messageContainer}>
            <Text style={styles.message}>{message}</Text>
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={handleClose}
            >
              <Text style={styles.cancelButtonText}>{cancelText}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.confirmButton, { backgroundColor: getBackgroundColor() }]} 
              onPress={() => {
                onConfirm();
                handleClose();
              }}
            >
              <Text style={styles.confirmButtonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: width - 80,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerContainer: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  messageContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center',
  },
  message: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderRightWidth: 1,
    borderRightColor: '#eee',
  },
  confirmButton: {
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  }
});

export default ConfirmationModal;