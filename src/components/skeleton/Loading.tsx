import {StyleSheet, View, ActivityIndicator, Image} from 'react-native';
import React from 'react';
import colors from '../../utils/color';
import CustomTitle from '../customize/Title';

const Loading = () => {
  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <Image source={require('../../assets/loading.png')} />
      </View>
      <View style={styles.body2}>
        <CustomTitle style={styles.title} title="Loading..." />
        <ActivityIndicator size={52}  style={styles.loading} />
      </View>
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.loadingColor,
  },
  body: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.light,
    padding: 20,
    borderRadius: 200,
  },
  body2: {
    marginTop: 10,

    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
  },
  loading: {
    marginTop: 10,
  },
  title: {
    color: colors.light,
  },
});
