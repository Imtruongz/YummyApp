import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Text,
} from 'react-native';
import React, {useState, useEffect} from 'react';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../android/types/StackNavType';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TabView, SceneMap} from 'react-native-tab-view';

import CustomAvatar from '../components/customize/Avatar';
import CustomTitle from '../components/customize/Title';

import color from '../utils/color';
import imgUrl from '../utils/urlImg.ts';
import FirstRoute from '../components/FirstRoute';
import SecondRoute from '../components/SecondRoute';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {RootState} from '../redux/store';
import colors from '../utils/color';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {getUserByIdAPI} from '../redux/slices/auth/authThunk.ts';

const initialLayout = {width: Dimensions.get('window').width};

interface ProfilePageProps
  extends NativeStackScreenProps<RootStackParamList, 'ProfilePage'> {}
const ProfilePage: React.FC<ProfilePageProps> = ({navigation}) => {
  const dispatch = useAppDispatch();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'first', title: 'Your Posts'},
    {key: 'second', title: 'Your favorites'},
  ]);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  const {user, isLoadingUser, isErrorUser} = useAppSelector(
    (state: RootState) => state.auth,
  );

  const fetchData = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');

      if (userId) {
        dispatch(getUserByIdAPI(userId));
      }
    } catch (error) {
      console.error('Error fetching data from AsyncStorage', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <CustomTitle style={styles.title} title="My profile" />
        <AntDesignIcon
          onPress={() => {
            navigation.navigate('SettingPage');
          }}
          name="setting"
          size={30}
          color={color.dark}
          style={styles.icon}
        />
      </View>
      <View style={styles.infoContainer}>
        {isLoadingUser ? (
          <ActivityIndicator size="large" color={color.primary} />
        ) : isErrorUser ? (
          <Text>Something went wrong</Text>
        ) : (
          <View style={styles.myInfoContainer}>
            <View style={styles.myInfo2}>
              <CustomAvatar
                style={styles.avatar}
                image={user?.avatar || imgUrl.UndefineImg}
              />
              <View style={styles.myInfo3}>
                <View style={styles.infoItem}>
                  <Text>Posts</Text>
                  <Text>0</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text>Follower</Text>
                  <Text>0</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text>Following</Text>
                  <Text>0</Text>
                </View>
              </View>
            </View>
            <CustomTitle title={user?.username} />
            <Text>Description</Text>
          </View>
        )}
      </View>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        style={styles.tabVIewContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  infoContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  myInfoContainer: {
    flexDirection: 'column',
    width: '100%',
    gap: 8,
  },
  myInfo2: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 24,
  },
  myInfo3: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 24,
  },
  infoItem: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: 8,
  },
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: color.primary,
  },
  statsContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 8,
  },
  stats: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: 14,
  },
  tabVIewContainer: {
    flex: 1,
  },
  icon: {
    padding: 12,
  },
  title: {
    fontSize: 24,
    padding: 12,
  },
});

export default ProfilePage;
