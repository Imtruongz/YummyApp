import {
  View,
  Button,
  StyleSheet,
  FlatList,
  Text,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../android/types/StackNavType';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TabView, SceneMap} from 'react-native-tab-view';
import {LinearGradient} from 'react-native-linear-gradient';

//Firebase
import auth from '@react-native-firebase/auth';

//Custom
import CustomFoodItem from '../components/customize/FoodItem';
import CustomAvatar from '../components/customize/Avatar';

// Redux
import {useAppSelector} from '../redux/hooks';
import {RootState} from '../redux/store';
import color from '../utils/color';

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
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <LinearGradient
      style={styles.contentContainer}
      colors={['#8B8B8B', '#000000']}>
      <SafeAreaView style={styles.contentContainer}>
        <View style={styles.header}>
          <CustomAvatar
            style={styles.avatar}
            img="https://live.staticflickr.com/65535/53280456787_5b57ceca8e_s.jpg"
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
    padding: 14,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: color.primary,
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
