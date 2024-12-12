import {View, Button} from 'react-native';
import React from 'react';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';

const ProfilePage = () => {
  const navigation :any = useNavigation();
  return (
    <View>
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
