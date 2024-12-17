import {View, Button, StyleSheet, Text, Image} from 'react-native';
import React, { useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../android/types/StackNavType';

import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {logout} from '../redux/slices/authSlice';
import {SafeAreaView} from 'react-native-safe-area-context';

import firestore from '@react-native-firebase/firestore';

interface ProfilePageProps
  extends NativeStackScreenProps<RootStackParamList, 'ProfilePage'> {}

const ProfilePage: React.FC<ProfilePageProps> = ({navigation}) => {
  const dispatch = useAppDispatch();
  const {isAuthenticated} = useAppSelector(state => state.auth);

  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [users, setUsers] = useState([]); // Initial empty array of users

  useEffect(() => {
    const subscriber = firestore()
      .collection('user')
      .onSnapshot(querySnapshot => {
        const users = [];

        querySnapshot.forEach(documentSnapshot => {
          users.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setUsers(users);
        setLoading(false);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  const handleSignOut = async () => {
    try {
      await auth().signOut();
      dispatch(logout());
      if (isAuthenticated === false) {
        console.log('Is Authenticated:', isAuthenticated);
        navigation.navigate('LoginPage');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.contentContainer}>
      <View style={styles.header}>
        <Image
          style={styles.headerImage}
          source={{
            uri: 'https://live.staticflickr.com/65535/53280456787_5b57ceca8e_s.jpg',
          }}
        />
        <View>
          <Text > Name: {users.userName} </Text>
          <Text> Email {users.email}: </Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text> Footer </Text>
      </View>
      <Button title="Log out" onPress={handleSignOut} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'gray',
  },
  header: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    gap: 14,
    backgroundColor: 'yellow',
  },
  footer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 14,
    backgroundColor: 'blue',
  },
  headerImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
});

export default ProfilePage;
