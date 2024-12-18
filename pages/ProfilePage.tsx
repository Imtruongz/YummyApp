import {
  View,
  Button,
  StyleSheet,
  Image,
  FlatList,
  useWindowDimensions,
  Text,
} from 'react-native';
import React from 'react';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../android/types/StackNavType';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TabView, SceneMap} from 'react-native-tab-view';

//Firebase
import auth from '@react-native-firebase/auth';
//import firestore from '@react-native-firebase/firestore';

//Custom
import CustomTitle from '../components/customize/Title';
import CustomFoodItem from '../components/customize/FoodItem';

// Redux
import {useAppSelector} from '../redux/hooks';
import {RootState} from '../redux/store';
//import {logout} from '../redux/slices/authSlice';

interface ProfilePageProps
  extends NativeStackScreenProps<RootStackParamList, 'ProfilePage'> {}

const ProfilePage: React.FC<ProfilePageProps> = ({navigation}) => {
  // const dispatch = useAppDispatch();
  // const {isAuthenticated} = useAppSelector(state => state.auth);
  const foodList = useAppSelector((state: RootState) => state.food.foods);

  const handleSignOut = async () => {
    try {
      await auth().signOut();
      navigation.navigate('LoginPage');
      //dispatch(logout());
      // if (isAuthenticated === false) {
      //   console.log('Is Authenticated:', isAuthenticated);
      //   navigation.navigate('LoginPage');
      // }
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
      </View>
      {/* Tab View */}

      {/* Tab View */}
      <View style={styles.footer}>
        <CustomTitle title="My food status" />
        <FlatList
          data={foodList}
          renderItem={({item}) => (
            <CustomFoodItem title={item.name} image={item.image} />
          )}
        />
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
