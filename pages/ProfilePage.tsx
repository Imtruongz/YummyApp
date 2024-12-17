import {View, Button} from 'react-native';
import React from 'react';
import auth from '@react-native-firebase/auth';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../android/types/StackNavType';

import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {logout} from '../redux/reducer/authSlice';

interface ProfilePageProps
  extends NativeStackScreenProps<RootStackParamList, 'ProfilePage'> {}

const ProfilePage: React.FC<ProfilePageProps> = ({navigation}) => {
  const dispatch = useAppDispatch();
    const {isAuthenticated} = useAppSelector(state => state.auth);
  
  const handleSignOut = async () => {
    try {
      await auth().signOut();
      dispatch(logout());
      if(isAuthenticated === false){
        console.log('Is Authenticated:', isAuthenticated);
        navigation.navigate('LoginPage');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View>
      <Button title="Log out" onPress={handleSignOut} />
    </View>
  );
};

export default ProfilePage;
