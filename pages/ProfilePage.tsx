import {
  View,
  Button,
  StyleSheet,
  Image,
  FlatList,
  Text,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../android/types/StackNavType';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TabView, SceneMap} from 'react-native-tab-view';
import { LinearGradient } from 'react-native-linear-gradient'

//Firebase
import auth from '@react-native-firebase/auth';
//import firestore from '@react-native-firebase/firestore';

//Custom
import CustomFoodItem from '../components/customize/FoodItem';

// Redux
import {useAppSelector} from '../redux/hooks';
import {RootState} from '../redux/store';
//import {logout} from '../redux/slices/authSlice';

const FirstRoute = () => {
  const foodList = useAppSelector((state: RootState) => state.food.foods);
  return (
    <View style={[styles.scene]}>
      <FlatList
        data={foodList}
        renderItem={({item}) => (
          <CustomFoodItem title={item.name} image={item.image} />
        )}
      />
    </View>
  );
};

const SecondRoute = () => (
  <View style={[styles.scene]}>
    <Text>Second Tab</Text>
  </View>
);

const initialLayout = {width: Dimensions.get('window').width};

interface ProfilePageProps
  extends NativeStackScreenProps<RootStackParamList, 'ProfilePage'> {}
const ProfilePage: React.FC<ProfilePageProps> = ({navigation}) => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'first', title: 'Your Posts'},
    {key: 'second', title: 'Your favorites'},
  ]);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

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
    <LinearGradient style={styles.contentContainer} colors={['#8B8B8B', '#000000']}>
      <SafeAreaView style={styles.contentContainer} >
        <View style={styles.header}>
          <Image
            style={styles.headerImage}
            source={{
              uri: 'https://live.staticflickr.com/65535/53280456787_5b57ceca8e_s.jpg',
            }}
          />
          <Button title="Log out" onPress={handleSignOut} />
        </View>
        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
        />
      </SafeAreaView>
      </LinearGradient>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  header: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
  },
  headerImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
  scene: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 14,
  },
});

export default ProfilePage;
