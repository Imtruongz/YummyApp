import React, { useRef } from 'react';
import { Animated, PanResponder, StyleSheet, Dimensions, TouchableOpacity, Platform, Image, Text} from 'react-native';
import {colors, YummyDrag, getStorageString, setStorageString} from '@/utils';
import { useTranslation } from 'react-i18next';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BUTTON_SIZE = 56;
const SNAP_MARGIN = 20;

interface DraggableFloatingButtonProps {
  onPress: () => void;
}

const DraggableFloatingButton: React.FC<DraggableFloatingButtonProps> = ({ onPress }) => {
  const { t } = useTranslation();
  const initialPosition = {
    x: Number(getStorageString('floatingButtonX')) || SCREEN_WIDTH - BUTTON_SIZE - SNAP_MARGIN,
    y: Number(getStorageString('floatingButtonY')) || SCREEN_HEIGHT - BUTTON_SIZE - SNAP_MARGIN
  };

  const position = useRef(new Animated.ValueXY(initialPosition)).current;
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        position.setValue({
          x: initialPosition.x + gesture.dx,
          y: initialPosition.y + gesture.dy
        });
      },
      onPanResponderRelease: (_, gesture) => {
        // Tính toán vị trí mới sau khi thả
        let newX = initialPosition.x + gesture.dx;
        let newY = initialPosition.y + gesture.dy;

        // Giới hạn trong màn hình
        newX = Math.max(SNAP_MARGIN, Math.min(SCREEN_WIDTH - BUTTON_SIZE - SNAP_MARGIN, newX));
        newY = Math.max(SNAP_MARGIN, Math.min(SCREEN_HEIGHT - BUTTON_SIZE - SNAP_MARGIN, newY));

        // Snap vào cạnh gần nhất
        if (newX < SCREEN_WIDTH / 2) {
          newX = SNAP_MARGIN;
        } else {
          newX = SCREEN_WIDTH - BUTTON_SIZE - SNAP_MARGIN;
        }

        // Cập nhật vị trí ban đầu
        initialPosition.x = newX;
        initialPosition.y = newY;

        // Animation di chuyển mượt mà đến vị trí mới
        Animated.spring(position, {
          toValue: { x: newX, y: newY },
          useNativeDriver: false,
          friction: 7,
          tension: 50,
        }).start();

        // Lưu vị trí mới
        setStorageString('floatingButtonX', String(newX));
        setStorageString('floatingButtonY', String(newY));
      },
    })
  ).current;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateX: position.x },
            { translateY: position.y },
          ],
        },
      ]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Image source={YummyDrag} style={{ width: 58, height: 58 }} resizeMode="contain" />
      </TouchableOpacity>
      <Text style={{ color: colors.primaryText, textAlign: 'center', fontSize: 14 , fontWeight: 'bold' }}>{t('yummy_ai')}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    ...Platform.select({
      ios: {
        shadowColor: colors.dark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export { DraggableFloatingButton };
export default DraggableFloatingButton;