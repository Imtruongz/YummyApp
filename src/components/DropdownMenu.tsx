import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Animated,
  Dimensions,
} from 'react-native';
import Typography from './customize/Typography';
import color from '../utils/color';

export interface MenuOption {
  id: string;
  label: string;
  onPress: () => void;
  icon?: string;
  isDestructive?: boolean;
}

interface DropdownMenuProps {
  options: MenuOption[];
  trigger?: React.ReactNode;
  onClose?: () => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  options,
  trigger,
  onClose,
}) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const triggerRef = useRef<any>(null);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const { width: screenWidth } = Dimensions.get('window');

  const handleOpen = () => {
    triggerRef.current?.measure((fx: number, fy: number, width: number, height: number, px: number, py: number) => {
      const menuWidth = 180;
      let alignX = px + width - menuWidth;
      
      // Ensure menu stays within screen bounds
      if (alignX < 10) {
        alignX = 10;
      } else if (alignX + menuWidth > screenWidth - 10) {
        alignX = screenWidth - menuWidth - 10;
      }

      setPosition({
        x: alignX,
        y: py + height + 8,
        width: width,
        height: height,
      });
      setVisible(true);
      
      // Animate scale
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleClose = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      onClose?.();
    });
  };

  const handleOptionPress = (option: MenuOption) => {
    handleClose();
    // Delay for animation to complete before executing action
    setTimeout(() => {
      option.onPress();
    }, 250);
  };

  const renderOption = ({ item, index }: { item: MenuOption; index: number }) => (
    <TouchableOpacity
      style={[
        styles.optionItem,
        index !== options.length - 1 && styles.optionItemBorder,
        item.isDestructive && styles.destructiveOption,
      ]}
      onPress={() => handleOptionPress(item)}
      activeOpacity={0.6}
    >
      {item.icon && (
        <Typography
          title={item.icon}
          fontSize={16}
          style={styles.optionIcon}
        />
      )}
      <Typography
        title={item.label}
        fontSize={14}
        fontWeight="500"
        color={item.isDestructive ? '#FF3B30' : color.dark}
      />
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity ref={triggerRef} onPress={handleOpen}>
        {trigger}
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="none">
        <TouchableOpacity
          style={styles.backdrop}
          onPress={handleClose}
          activeOpacity={1}
        >
          <Animated.View
            style={[
              styles.dropdownContainer,
              {
                left: position.x,
                top: position.y,
                transform: [
                  {
                    scale: scaleAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
                opacity: scaleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
              },
            ]}
          >
            <FlatList
              data={options}
              keyExtractor={(item) => item.id}
              renderItem={renderOption}
              scrollEnabled={false}
            />
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  dropdownContainer: {
    position: 'absolute',
    backgroundColor: color.white,
    borderRadius: 12,
    minWidth: 180,
    maxWidth: 250,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  optionItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  destructiveOption: {
    backgroundColor: 'rgba(255, 59, 48, 0.05)',
  },
  optionIcon: {
    marginRight: 10,
  },
});

export default DropdownMenu;
