import {
  ActivityIndicator,
  PermissionsAndroid,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import color from '../utils/color';
import {launchImageLibrary} from 'react-native-image-picker';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {RootState} from '../redux/store.ts';
import Toast from 'react-native-toast-message';
import img from '../utils/urlImg.ts';
import CustomInput from '../components/customize/Input.tsx';
import CustomButton from '../components/customize/Button.tsx';
import {userUpdateAPI} from '../redux/slices/auth/authThunk.ts';
import {getUserByIdAPI} from '../redux/slices/auth/authThunk.ts';
import OverlayBadge from '../components/customize/OverlayBadge.tsx';
import Header from '../components/customize/Header.tsx';

import {MMKV} from 'react-native-mmkv';
import {SafeAreaView} from 'react-native-safe-area-context';
const storage = new MMKV();

const userId = storage.getString('userId') || '';

const SettingProfilePage = () => {
  const dispatch = useAppDispatch();
  const [username, setusername] = useState('');
  const [avatar, setavatar] = useState('');
  const [description, setdescription] = useState('');

  const {user, isLoadingUser, isErrorUser} = useAppSelector(
    (state: RootState) => state.auth,
  );

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
          setavatar(result.assets[0].uri);
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

  const handleUpdateAccount = async () => {
    if (!username || !description || !avatar) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fill out all fields before updating.',
      });
      return;
    }

    try {
      const payload = {
        userId: userId,
        username: username,
        description: description,
        avatar: avatar,
      };

      const resultAction = await dispatch(userUpdateAPI(payload)).unwrap();
      if (resultAction) {
        Toast.show({
          type: 'success',
          text1: 'Successfully Updated',
          text2: 'Your profile has been updated.',
        });
      }
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: err.message || 'Something went wrong!',
      });
    }
  };

  useEffect(() => {
    dispatch(getUserByIdAPI(userId));
    setusername(user?.username || '');
    setdescription(user?.description || '');
    setavatar(user?.avatar || '');
  }, [dispatch, user?.username, user?.description, user?.avatar]);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Edit Profile" iconName="arrowleft" />
      <View style={styles.body}>
        {isLoadingUser ? (
          <ActivityIndicator size="large" color={color.primary} />
        ) : isErrorUser ? (
          <Text>Something went wronggg</Text>
        ) : (
          <OverlayBadge
            imageUrl={avatar || img.UndefineImg}
            onEditPress={() => requestCameraPermission()}
          />
        )}
        <CustomInput
          value={username}
          onChangeText={setusername}
          placeholder="Enter your username"
        />
        <CustomInput placeholder={user?.email} isDisabled={false} />
        <CustomInput placeholder={user?.phoneNumber} isDisabled={false} />
        <CustomInput
          value={description}
          onChangeText={setdescription}
          placeholder="Enter your description"
          isDisabled={true}
        />
        <CustomButton onPress={handleUpdateAccount} title="Save" />
        <CustomButton title="Cancel" />
      </View>
    </SafeAreaView>
  );
};

export default SettingProfilePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.light,
  },
  title: {
    fontWeight: 'bold',
    borderBottomColor: color.dark,
    borderBottomWidth: 1,
    width: '100%',
    fontFamily: 'Roboto',
  },
  body: {
    padding: 12,
    gap: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
