import {View, StyleSheet, Dimensions} from 'react-native';
import React, {useState} from 'react';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../android/types/StackNavType';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TabView, SceneMap} from 'react-native-tab-view';
import {LinearGradient} from 'react-native-linear-gradient';

//Custom
import CustomAvatar from '../components/customize/Avatar';
import color from '../utils/color';
import FirstRoute from '../components/FirstRoute';
import SecondRoute from '../components/SecondRoute';

import AntDesignIcon from 'react-native-vector-icons/AntDesign';

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

  return (
    <LinearGradient style={styles.container} colors={['#8B8B8B', '#000000']}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <CustomAvatar
            style={styles.avatar}
            img="https://live.staticflickr.com/65535/53459716820_a6c3ce93a8_w.jpg"
          />
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
