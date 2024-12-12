import {View, Button, Text} from 'react-native';
import React from 'react';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';

const ProfilePage = () => {
  const navigation :any = useNavigation();

  const user = auth().currentUser;
  user?.providerData.forEach((userInfo) => {
    console.log('User info name: ', userInfo.displayName);
    console.log(user?.emailVerified);
  });

  return (
    <View>
      <Text>{user?.emailVerified}</Text>
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
