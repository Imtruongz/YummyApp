import {Button, StyleSheet, View} from 'react-native';
import React from 'react';

interface customModalProps {
  onPress?: () => void;
}

const customModal: React.FC<customModalProps> = ({onPress}) => {
  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Button title="Close Modal" onPress={onPress} />
      </View>
    </View>
  );
};

export default customModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightColor: 'gray',
  },
  modalContent: {
    width: 300,
    height: 200,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
});
