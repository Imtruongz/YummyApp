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
import CustomInput from '../components/customize/CustomInput.tsx';
import CustomButton from '../components/customize/CustomButton.tsx';
import {userUpdateAPI} from '../redux/slices/auth/authThunk.ts';
import {getUserByIdAPI} from '../redux/slices/auth/authThunk.ts';
import OverlayBadge from '../components/customize/OverlayBadge.tsx';
import HomeHeader from '../components/HomeHeader';
import {useTranslation} from 'react-i18next';
import RNFS from 'react-native-fs';
import {useNavigation} from '@react-navigation/native';

import {MMKV} from 'react-native-mmkv';
import {SafeAreaView} from 'react-native-safe-area-context';
const storage = new MMKV();

const userId = storage.getString('userId') || '';

// Hàm chuyển đổi hình ảnh sang base64
const convertImageToBase64 = async (uri: string): Promise<string> => {
  try {
    if (uri.startsWith('file://')) {
      const base64Data = await RNFS.readFile(uri, 'base64');
      return `data:image/jpeg;base64,${base64Data}`;
    } else if (uri.startsWith('content://')) {
      console.log('Need to handle content:// URI');
      const base64Data = await RNFS.readFile(uri, 'base64');
      return `data:image/jpeg;base64,${base64Data}`;
    } else {
      console.log('Unsupported URI format');
      return '';
    }
  } catch (error) {
    console.log('Error converting image to base64:', error);
    return '';
  }
};

const SettingProfilePage = () => {
  const {t, i18n} = useTranslation();
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
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
          includeBase64: false,
          maxHeight: 800,
          maxWidth: 800,
        });
        if (result.assets && result.assets.length > 0) {
          const imageUri = result.assets[0].uri;
          const base64Image = await convertImageToBase64(imageUri);
          setavatar(base64Image);
        } else {
          console.log('No image selected or camera launch failed');
        }
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.log(err);
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
        navigation.goBack();
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
    dispatch(getUserByIdAPI({userId}));
    setusername(user?.username || '');
    setdescription(user?.description || '');
    setavatar(user?.avatar || '');
  }, [dispatch, user?.username, user?.description, user?.avatar]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <HomeHeader
        mode="back"
        title={t('edit_profile_header')}
        showGoBack={true}
        showNotification={false}
      />
      <View style={styles.body}>
        {isLoadingUser ? (
          <ActivityIndicator size="large" color={color.primary} />
        ) : isErrorUser ? (
          <Text>Something went wronggg</Text>
        ) : (
          <OverlayBadge
            imageUrl={avatar || img.defaultAvatar}
            onEditPress={() => requestCameraPermission()}
          />
        )}
        <CustomInput
          value={username}
          onChangeText={setusername}
          placeholder={t('edit_profile_input_name')}
        />
        <CustomInput placeholder={user?.email} isDisabled={false} />
        <CustomInput
          value={description}
          onChangeText={setdescription}
          placeholder={t('edit_profile_input_description')}
          isDisabled={true}
        />
        <CustomButton
          onPress={handleUpdateAccount}
          title={t('edit_profile_btn_save')}
        />
        <CustomButton title={t('edit_profile_btn_cancel')} />
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
  },
  body: {
    padding: 12,
    gap: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
