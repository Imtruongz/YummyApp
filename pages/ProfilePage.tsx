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
import {
  TabView,
  SceneMap,
  TabBar,
  SceneRendererProps,
  NavigationState,
  Route,
} from 'react-native-tab-view';

import CustomAvatar from '../components/customize/Avatar';
import CustomTitle from '../components/customize/Title';

import imgUrl from '../utils/urlImg.ts';
import FirstRoute from '../components/FirstRoute';
import SecondRoute from '../components/SecondRoute';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {RootState} from '../redux/store';
import colors from '../utils/color';
import {getUserByIdAPI} from '../redux/slices/auth/authThunk.ts';

import {MMKV} from 'react-native-mmkv';
import Typography from '../components/customize/Typography.tsx';
const storage = new MMKV();

const userId = storage.getString('userId') || '';

const initialLayout = {width: Dimensions.get('window').width};

interface InfoItemProps {
  number: number | string;
  label: string;
}

const InfoItem: React.FC<InfoItemProps> = ({number, label}) => (
  <View style={styles.infoItem}>
    <Typography title={number} fontSize={14} fontFamily="Poppins-SemiBold" />
    <Typography title={label} fontSize={12} fontFamily="Poppins-Medium" />
  </View>
);

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

  const {userFoodList} = useAppSelector((state: RootState) => state.food);

  const renderTabBar = (
    props: SceneRendererProps & {navigationState: NavigationState<Route>},
  ) => (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: colors.primaryHover}}
      style={{backgroundColor: colors.light}}
      activeColor={colors.primaryHover}
      inactiveColor={colors.dark}
    />
  );

  useEffect(() => {
    dispatch(getUserByIdAPI(userId));
    console.log('getUserByIdAPI rendered successfully');
  }, [dispatch]);

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
          color={colors.dark}
          style={styles.icon}
        />
      </View>
      <View style={styles.infoContainer}>
        {isLoadingUser ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : isErrorUser ? (
          <Text>Something went wrong</Text>
        ) : (
          <View style={styles.myInfoContainer}>
            <View style={styles.myInfo2}>
              <CustomAvatar
                width={70}
                height={70}
                borderRadius={35}
                image={user?.avatar || imgUrl.defaultAvatar}
              />
              <View style={styles.myInfo3}>
                <InfoItem number={userFoodList.length ?? 0} label="Posts" />
                <InfoItem number="0" label="Follower" />
                <InfoItem number="0" label="Following" />
              </View>
            </View>
            <CustomTitle title={user?.username} />
            <Text>{user?.description}</Text>
          </View>
        )}
      </View>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        style={styles.tabVIewContainer}
        renderTabBar={renderTabBar}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  infoContainer: {
    minHeight: 140,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
  myInfoContainer: {
    flexDirection: 'column',
    width: '100%',
  },
  myInfo2: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 24,
  },
  myInfo3: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 32,
  },
  infoItem: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: 4,
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
    borderColor: colors.primary,
  },
  tabVIewContainer: {
    flex: 1,
    backgroundColor: colors.light,
  },
  icon: {
    padding: 12,
  },
  title: {
    padding: 12,
  },
});

export default ProfilePage;
