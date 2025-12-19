import React from 'react';
import {View, Image, TouchableOpacity, StyleSheet} from 'react-native';
import { IconSvg } from '@/components'
import {colors, ImagesSvg} from '@/utils';

interface OverlayBadgeProps {
  imageUrl: string;
  onEditPress: () => void;
}
const OverlayBadge: React.FC<OverlayBadgeProps> = ({imageUrl, onEditPress}) => {
  return (
    <View style={styles.container2}>
      <View style={styles.container}>
        <Image source={{uri: imageUrl}} style={styles.avatar} />
      </View>
      <TouchableOpacity style={styles.editBadge} onPress={onEditPress}>
        <IconSvg xml={ImagesSvg.icEdit} width={16} height={16} color='black' />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container2: {
    width: 100,
    height: 100,
    borderRadius: 50,
    shadowColor: colors.dark,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  container: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.light,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.white,
    borderRadius: 50,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.dark,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
});

export { OverlayBadge };
export default OverlayBadge;
