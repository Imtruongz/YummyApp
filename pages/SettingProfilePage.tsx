import {
  ActivityIndicator,
  PermissionsAndroid,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import color from '../utils/color';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../android/types/StackNavType';
import CustomTitle from '../components/customize/Title';
import {launchImageLibrary} from 'react-native-image-picker';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {RootState} from '../redux/store.ts';
import Toast from 'react-native-toast-message';
import img from '../utils/urlImg.ts';
import CustomInput from '../components/customize/Input.tsx';
import CustomButton from '../components/customize/Button.tsx';
import {userUpdateAPI} from '../redux/slices/auth/authThunk.ts';
import OverlayBadge from '../components/customize/OverlayBadge.tsx';

interface SettingProfilePageProps
  extends NativeStackScreenProps<RootStackParamList, 'SettingProfilePage'> {}
const SettingProfilePage: React.FC<SettingProfilePageProps> = ({
  navigation,
}) => {
  const dispatch = useAppDispatch();
  const [username, setusername] = useState<string>('');
  const [avatar, setavatar] = useState<string>('');

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
    try {
      // Update user account
      dispatch(
        userUpdateAPI({
          userId: user?.userId,
          username: username,
          avatar: avatar,
        }),
      );
      Toast.show({
        type: 'success',
        text1: 'Update success',
        text2: 'Your account has been updated',
      });
      setavatar('');
    } catch (error) {
      console.log('Update process failed', error);
      Toast.show({
        type: 'error',
        text1: 'Update failed',
        text2: 'Please try again latttter',
      });
    }
  };
 
  useEffect(() => {
    if (user?.username && user?.avatar) {
      setusername(user.username);
      setavatar(user.avatar);
    }
    console.log('re-render');
  }, [dispatch, user?.avatar, user?.username]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AntDesignIcon
          name="arrowleft"
          size={24}
          color={color.dark}
          style={styles.icon}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <CustomTitle style={styles.title1} title="Edit Profile" />
      </View>
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
        <CustomButton onPress={handleUpdateAccount} title="Save" />
        <CustomButton title="Cancel" />
      </View>
    </View>
  );
};

export default SettingProfilePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.light,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: color.secondary,
  },
  title1: {
    color: color.dark,
    fontSize: 24,
    textAlign: 'center',
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
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
    marginBottom: 10,
  },
  accountContainer: {
    marginBottom: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountSetting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
  },
  SystemContainer: {
    marginBottom: 10,
  },
  btn: {
    width: '80%',
    height: 40,
    backgroundColor: color.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    flexDirection: 'row',
  },
  icon: {
    padding: 12,
    paddingHorizontal: 14,
    marginRight: 64,
  },
});
