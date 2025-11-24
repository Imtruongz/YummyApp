import React from 'react';
import { View, StyleSheet, StatusBar, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar } from 'react-native-paper';
import Typography from './customize/Typography';
import { IconButton } from 'react-native-paper';
import color from '../utils/color';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import imgURL from '../utils/urlImg';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppSelector } from '../redux/hooks';
import IconSvg from './IconSvg';
import { ImagesSvg } from '../utils/ImageSvg';

type RootStackParamList = {
  NotificationsScreen: { userId: string | undefined };
};

type HomeHeaderNavigationProp = NativeStackNavigationProp<RootStackParamList, 'NotificationsScreen'>;

type HeaderMode = 'home' | 'title' | 'search' | 'profile' | 'back';

interface HomeHeaderProps {
  // Props cho home mode
  avatar?: string;
  username?: string;
  greetingMessage?: React.ReactNode;

  // Props chung
  mode?: HeaderMode;
  title?: string;
  showNotification?: boolean;
  showGoBack?: boolean;
  onNotificationPress?: () => void;
  onGoBack?: () => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({
  avatar,
  username,
  greetingMessage,
  mode = 'home',
  title,
  showNotification = true,
  showGoBack = false,
  onNotificationPress,
  onGoBack
}) => {
  const navigation = useNavigation<HomeHeaderNavigationProp>();
  const user = useAppSelector(state => state.auth.user);
  const insets = useSafeAreaInsets();

  const handleNotificationPress = () => {
    if (onNotificationPress) {
      onNotificationPress();
    } else {
      navigation.navigate('NotificationsScreen', { userId: user?.userId });
    }
  };

  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
    } else {
      navigation.goBack();
    }
  };

  const renderLeftContent = () => {
    switch (mode) {
      case 'home':
        return (
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
        );

      case 'title':
      case 'search':
      case 'profile':
      case 'back':
        return (
          <View style={styles.titleContainer}>
            <Typography
              title={title}
              fontSize={20}
              fontWeight='700'
              color={color.dark}
            />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={{ backgroundColor: color.primaryHover }}>
      <StatusBar backgroundColor={color.primaryHover} barStyle="light-content" />
      <View style={[styles.headerContainer, { paddingHorizontal: showGoBack ? 0 : 16, paddingTop: insets.top || 12 }]}>
        <View style={styles.leftContainer}>
          {showGoBack && (
            <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}><IconSvg xml={ImagesSvg.icArrowLeft} width={24} height={24} color='black' /></TouchableOpacity>
          )}
          {renderLeftContent()}
        </View>
        <View style={styles.rightContainer}>
          {showNotification ? (
            <TouchableOpacity onPress={handleNotificationPress} ><IconSvg xml={ImagesSvg.imageNotification} width={100} height={30} color='white' /></TouchableOpacity>
          ) : (
            <View style={styles.placeholderButton} />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
    backgroundColor: color.primaryHover,
    minHeight: 46, // Cố định chiều cao tối thiểu
  },
  leftContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  header1: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  goBackButton: {
    marginHorizontal: 16,

  },
  rightContainer: {
    width: 42, // Cố định width để luôn có space cho notification button
    height: 42, // Cố định height
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderButton: {
    width: 42,
    height: 42, // Cùng kích thước với IconButton để maintain layout
  },
});

export default HomeHeader;
