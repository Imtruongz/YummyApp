import { StyleSheet, View } from 'react-native';
import React from 'react';
import colors from '../utils/color';
import CustomTitle from './customize/Title';
import { useTranslation } from 'react-i18next';
import IconSvg from './IconSvg';
import { ImagesSvg } from '../utils/ImageSvg';
import CustomLoadingSpinner from './CustomLoadingSpinner';

const Loading = () => {
  const { t, i18n } = useTranslation();
  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <IconSvg xml={ImagesSvg.icChef} width={64} height={64} color={colors.primary} />
      </View>
      <View style={styles.body2}>
        <CustomTitle style={styles.title} title={t('loading')} />
        <CustomLoadingSpinner
          size={50}
          color={colors.light}
          style={styles.loading}
        />
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
