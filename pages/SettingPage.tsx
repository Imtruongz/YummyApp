import {
  StyleSheet,
  View,
  Image,
  PermissionsAndroid,
  Pressable,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../android/types/StackNavType';
import CustomTitle from '../components/customize/Title';
import CustomButton from '../components/customize/Button';
import color from '../utils/color';
import auth from '@react-native-firebase/auth';
import CustomInput from '../components/customize/Input';
import {launchImageLibrary} from 'react-native-image-picker';
import Toast from 'react-native-toast-message';

interface SettingPageProps
  extends NativeStackScreenProps<RootStackParamList, 'SettingPage'> {}
const SettingPage: React.FC<SettingPageProps> = ({navigation}) => {
  const user = auth().currentUser;
  const [username, setUsername] = useState<string>('');
  const [photoURL, setPhotoURL] = useState<string>('');

  useEffect(() => {
    setUsername(user?.displayName ?? '');
    setPhotoURL(user?.photoURL ?? '');
  }, [user]);

  const handleUpdateAccount = async () => {
    try {
      await user?.updateProfile({
        displayName: username,
        photoURL: photoURL,
      });
      console.log('Update success', username, photoURL);
      Toast.show({
        type: 'success',
        text1: 'Update success',
        text2: 'Your account has been updateddddddd',
      });
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Update failed',
        text2: 'Please try again',
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <CustomTitle title="Setting" />
      </View>
      <View style={styles.body}>
        <CustomTitle title="Edit my account" />
        <CustomInput
          placeholder="username"
          value={username}
          onChangeText={setUsername}
        />
        <Pressable onPress={() => requestCameraPermission()}>
          <Image
            source={{
              uri:
                photoURL ||
                'https://i.pinimg.com/originals/33/6e/8d/336e8ddb981a8187414e92da98c6156a.png',
            }}
            style={styles.imagePreview}
          />
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
