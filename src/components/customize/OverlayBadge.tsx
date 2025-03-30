import React from 'react';
import {View, Image, TouchableOpacity, StyleSheet} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import colors from '../../utils/color';

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
        <AntDesignIcon name="edit" size={20} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container2: {
    width: 100,
    height: 100,
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
    backgroundColor: 'green',
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

export default OverlayBadge;
