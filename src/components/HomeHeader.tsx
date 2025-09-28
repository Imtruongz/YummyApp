import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar } from 'react-native-paper';
import Typography from './customize/Typography';
import { IconButton } from 'react-native-paper';
import color from '../utils/color';
import imgURL from '../utils/urlImg';
import Greeting from './customize/Greeting';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  NotificationsScreen: { userId: string | undefined };
  // Add other screens here if needed
};

type HomeHeaderNavigationProp = NativeStackNavigationProp<RootStackParamList, 'NotificationsScreen'>;
import { useAppSelector } from '../redux/hooks';
const navigation = useNavigation<HomeHeaderNavigationProp>();
interface HomeHeaderProps {
  avatar?: string;
  username?: string;
  greetingMessage: React.ReactNode;
  navigation: any;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ avatar, username, greetingMessage, navigation }) => {
  const user = useAppSelector(state => state.auth.user);
  return (
    <SafeAreaView style={{ backgroundColor: color.primaryHover }}>
      <StatusBar backgroundColor={color.primaryHover} barStyle="light-content" />
      <View style={styles.headerContainer}>
        <View style={styles.header1}>
          <Avatar.Image
            size={42}
            source={{ uri: avatar || imgURL.defaultAvatar }}
          />
          <View>
            {greetingMessage}
            <Typography
              title={username}
              fontSize={18}
              fontWeight='500'
            />
          </View>
        </View>
        <IconButton icon="bell" size={24} iconColor={color.dark} onPress={() => navigation.navigate('NotificationsScreen', { userId: user?.userId })} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: color.primaryHover,
  },
  header1: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});

export default HomeHeader;
