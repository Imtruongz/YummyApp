import {View, Button, Text} from 'react-native';
import React from 'react';
import auth from '@react-native-firebase/auth';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../android/types/StackNavType';

interface ProfilePageProps
  extends NativeStackScreenProps<RootStackParamList, 'ProfilePage'> {}

const ProfilePage: React.FC<ProfilePageProps> = ({navigation, route}) => {

  const {email} = route.params;

  return (
    <View>
      <Text>{email}</Text>
      <Button
        title="Log out"
        onPress={() =>
          auth()
            .signOut()
            .then(() => navigation.navigate('LoginPage'))
        }
      />
    </View>
  );
};

export default ProfilePage;
