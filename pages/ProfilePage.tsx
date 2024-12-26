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
import {LinearGradient} from 'react-native-linear-gradient';

import CustomAvatar from '../components/customize/Avatar';
import CustomTitle from '../components/customize/Title';

import auth from '@react-native-firebase/auth';
import color from '../utils/color';
import imgUrl from '../utils/urlImg.ts';
import FirstRoute from '../components/FirstRoute';
import SecondRoute from '../components/SecondRoute';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {RootState} from '../redux/store';
import {accountAPI} from '../redux/slices/account/accountSlice.ts';

const initialLayout = {width: Dimensions.get('window').width};

interface ProfilePageProps
  extends NativeStackScreenProps<RootStackParamList, 'ProfilePage'> {}
const ProfilePage: React.FC<ProfilePageProps> = ({navigation}) => {
  const user = auth().currentUser;
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

  const {MyAccount, isErrorAccount, isloadingAccount} = useAppSelector(
    (state: RootState) => state.account,
  );

  useEffect(() => {
    dispatch(accountAPI(user?.uid ?? ''));
  }, [dispatch, user]);

  return (
    <LinearGradient style={styles.container} colors={['#8B8B8B', '#000000']}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          {isloadingAccount ? (
            <ActivityIndicator size="large" color={color.primary} />
          ) : isErrorAccount ? (
            <Text>Something went wrong</Text>
          ) : (
            <View>
              <CustomAvatar
                style={styles.avatar}
                image={MyAccount?.photoURL || imgUrl.UndefineImg}
              />
              <CustomTitle title={MyAccount?.displayName} />
            </View>
          )}

          <AntDesignIcon
            onPress={() => {
              navigation.navigate('SettingPage');
            }}
            style={styles.settingIcon}
            name="setting"
            size={30}
            color={color.light}
          />
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
  container: {
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
  settingIcon: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
});

export default ProfilePage;
