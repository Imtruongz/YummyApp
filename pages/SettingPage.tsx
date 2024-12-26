import {
  StyleSheet,
  View,
  Image,
  PermissionsAndroid,
  Pressable,
  ActivityIndicator,
  Text,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../android/types/StackNavType';
import {launchImageLibrary} from 'react-native-image-picker';

import CustomTitle from '../components/customize/Title';
import CustomButton from '../components/customize/Button';
import CustomInput from '../components/customize/Input';

import color from '../utils/color';
import img from '../utils/urlImg.ts';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';

import {useAppDispatch, useAppSelector} from '../redux/hooks';
//import {updateProfile} from '../redux/slices/account/accountSlice';

import database from '@react-native-firebase/database';
import {RootState} from '../redux/store.ts';

import {accountAPI} from '../redux/slices/account/accountSlice.ts';

interface SettingPageProps
  extends NativeStackScreenProps<RootStackParamList, 'SettingPage'> {}
const SettingPage: React.FC<SettingPageProps> = ({navigation}) => {
  const dispatch = useAppDispatch();
  const user = auth().currentUser;
  const [displayName, setdisplayName] = useState<string>('');
  const [photoURL, setPhotoURL] = useState<string>('');

  const {MyAccount, isErrorAccount, isloadingAccount} = useAppSelector(
    (state: RootState) => state.account,
  );

  const handleUpdateAccount = async () => {
    try {
      await user?.updateProfile({
        displayName: displayName,
        photoURL: photoURL,
      });
      //dispatch(updateProfile({displayName, photoURL}));

      const userRef = database().ref(`/users/${user?.uid}`);
      await userRef.update({displayName, photoURL});
      console.log('Update process success', user);
      Toast.show({
        type: 'success',
        text1: 'Update success',
        text2: 'Your account has been updatedddd',
      });
    } catch (error) {
      console.log('Update process failed', error);
      Toast.show({
        type: 'error',
        text1: 'Update failed',
        text2: 'Please try again latttter',
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await auth().signOut();
      navigation.navigate('LoginPage');
    } catch (error) {
      console.log(error);
    }
  };

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const result: any = await launchImageLibrary({
          mediaType: 'photo',
        });
        if (result.assets && result.assets.length > 0) {
          setPhotoURL(result.assets[0].uri);
        } else {
          console.log('No image selected or camera launch failed');
        }
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    setdisplayName(user?.displayName ?? '');
    setPhotoURL(user?.photoURL ?? '');
    dispatch(accountAPI(user?.uid ?? ''));
  }, [user, dispatch]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <CustomTitle title="Setting" />
      </View>
      <View style={styles.body}>
        <CustomTitle title="Edit my account" />
        <CustomInput
          placeholder="displayName"
          value={MyAccount?.displayName}
          onChangeText={setdisplayName}
        />
        <Pressable onPress={() => requestCameraPermission()}>
          {isloadingAccount ? (
            <ActivityIndicator size="large" color={color.primary} />
          ) : isErrorAccount ? (
            <Text>Something went wronggg</Text>
          ) : (
            <Image
              source={{
                uri: MyAccount?.photoURL || img.UndefineImg,
              }}
              style={styles.imagePreview}
            />
          )}
        </Pressable>

        <CustomButton title="Update" onPress={handleUpdateAccount} />
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
    padding: 14,
    flex: 9,
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 14,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
    marginBottom: 10,
  },
});
