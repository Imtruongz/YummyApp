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
import colors from '../utils/color';

// Icons import
const IoniconsIcon = require('react-native-vector-icons/Ionicons').default;

export interface NotificationModalProps {
  visible: boolean;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number; // Thời gian tự động đóng (ms), 0 = không tự đóng
  onClose: () => void;
  onAction?: () => void;
  actionText?: string;
  showCloseButton?: boolean;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  visible,
  title,
  message,
  type = 'info',
  duration = 3000,
  onClose,
  onAction,
  actionText,
  showCloseButton = true
}) => {
  const [animation] = useState(new Animated.Value(0));
  
  useEffect(() => {
    if (visible) {
      Animated.spring(animation, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8
      }).start();
      
      // Tự động đóng nếu duration > 0
      if (duration > 0) {
        const timer = setTimeout(() => {
          handleClose();
        }, duration);
        
        return () => clearTimeout(timer);
      }
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
  
  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 0]
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
              backgroundColor: getBackgroundColor(),
              transform: [{ translateY }] 
            }
          ]}
        >
          <View style={styles.iconContainer}>
            <IoniconsIcon name={getIcon()} size={28} color="#fff" />
          </View>
          
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            
            {onAction && actionText && (
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => {
                  onAction();
                  handleClose();
                }}
              >
                <Text style={styles.actionText}>{actionText}</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {showCloseButton && (
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <IoniconsIcon name="close" size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingTop: Platform.OS === 'ios' ? 40 : 10
  },
  modalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width - 40,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  message: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  closeButton: {
    padding: 5,
    marginLeft: 8,
  },
  actionButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  }
});

export { NotificationModal };
export default NotificationModal;