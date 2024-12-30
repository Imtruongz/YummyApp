import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../android/types/StackNavType';
import CustomTitle from '../components/customize/Title';
import color from '../utils/color';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

interface SettingPageProps
  extends NativeStackScreenProps<RootStackParamList, 'SettingPage'> {}
const SettingPage: React.FC<SettingPageProps> = ({navigation}) => {
  const handleSignOut = () => {
    navigation.navigate('LoginPage');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AntDesignIcon
          name="arrowleft"
          size={24}
          color={color.dark}
          onPress={() => {
            navigation.goBack();
          }}
        />
      </View>
      <View style={styles.body}>
        <CustomTitle style={styles.title1} title="Settings" />
        <View style={styles.accountContainer}>
          <CustomTitle style={styles.title} title="Account" />
          <TouchableOpacity
            style={styles.accountSetting}
            onPress={() => navigation.navigate('SettingProfilePage')}>
            <Text>Profile Settings</Text>
            <AntDesignIcon name="right" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.accountSetting}
            onPress={() => navigation.navigate('SettingProfilePage')}>
            <Text>Password Setting</Text>
            <AntDesignIcon name="right" />
          </TouchableOpacity>
        </View>
        <View style={styles.SystemContainer}>
          <CustomTitle style={styles.title} title="System" />
          <TouchableOpacity
            style={styles.accountSetting}
            onPress={handleSignOut}>
            <Text style={{color: color.danger, fontWeight: 'bold'}}>
              Log Out
            </Text>
            <AntDesignIcon name="right" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SettingPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.light,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: color.secondary,
    padding: 12,
  },
  title1: {
    color: color.dark,
    fontSize: 24,
    textAlign: 'center',
  },
  title: {
    fontWeight: 'bold',
    borderBottomColor: color.dark,
    borderBottomWidth: 1,
    width: '100%',
    fontFamily: 'Roboto',
  },
  body: {
    padding: 12,
    gap: 14,
    justifyContent: 'center',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
    marginBottom: 10,
  },
  accountContainer: {
    marginBottom: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountSetting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
  },
  SystemContainer: {
    marginBottom: 10,
  },
});
