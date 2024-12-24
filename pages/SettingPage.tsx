import {StyleSheet, View} from 'react-native';
import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../android/types/StackNavType';
import CustomTitle from '../components/customize/Title';
import CustomButton from '../components/customize/Button';
import color from '../utils/color';
import auth from '@react-native-firebase/auth';

interface SettingPageProps
  extends NativeStackScreenProps<RootStackParamList, 'SettingPage'> {}
const SettingPage: React.FC<SettingPageProps> = ({navigation}) => {
  const handleSignOut = async () => {
    try {
      await auth().signOut();
      navigation.navigate('LoginPage');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <CustomTitle title="Setting" />
      </View>
      <View style={styles.body}>
        <CustomButton title="Log Out" onPress={handleSignOut} />
      </View>
    </View>
  );
};

export default SettingPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.light,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.secondary,
  },
  body: {
    flex: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
