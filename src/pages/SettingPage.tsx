import React, { useContext, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  Pressable,
  Modal,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../android/types/StackNavType';
import CustomTitle from '../components/customize/Title';
import SettingButton from '../components/customize/SettingButton';
import colors from '../utils/color';
import Header from '../components/customize/Header';
import { LoginManager } from 'react-native-fbsdk-next';
import { MMKV } from 'react-native-mmkv';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../contexts/AuthContext';

import '../languages/i18n'; // đảm bảo file i18n.ts được import đến
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../languages/i18n';

const storage = new MMKV();

interface SettingPageProps
  extends NativeStackScreenProps<RootStackParamList, 'SettingPage'> { }

const SettingPage: React.FC<SettingPageProps> = ({ navigation }) => {
  const { signOut } = useContext(AuthContext);
  const { t, i18n } = useTranslation();

  // Danh sách các ngôn ngữ khả dụng
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'vn', label: 'Tiếng Việt' },
    { code: 'zh', label: '简体中文' }
  ];

  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const handleSelectLanguage = async (lang: string) => {
    setLanguageModalVisible(false);
    await changeLanguage(lang);
    console.log('Language changed to:', i18n.language);
  };

  const handleLogout = () => {
    Alert.alert(
      t('setting_logout'),
      t('Are you sure you want to log out?'),
      [
        {
          text: t('Cancel'),
          style: 'cancel',
        },
        { text: t('OK'), onPress: logout },
      ],
      { cancelable: false },
    );
  };

  const logout = async () => {
    try {
      // Đăng xuất Facebook
      LoginManager.logOut();

      // Xóa token và thông tin người dùng
      storage.delete('accessToken');
      storage.delete('refreshToken');
      storage.delete('userId');

      // Gọi signOut từ AuthContext để cập nhật trạng thái đăng nhập
      signOut();
    } catch (exception) {
      console.error('Error during logout:', exception);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title={t('setting_settings_header')} iconName="arrowleft" />
      <View style={styles.accountContainer}>
        <CustomTitle style={styles.title} title={t('setting_account')} />
        <SettingButton
          title={t('setting_profile_setting')}
          navigation={navigation}
          targetScreen="SettingProfilePage"
        />
        <SettingButton
          title={t('setting_Password')}
          navigation={navigation}
          targetScreen="ChangePasswordPage"
        />

        {/* Phần chọn ngôn ngữ */}
        <View style={styles.languageContainer}>
          <CustomTitle title={t('setting_language')} />
          <Pressable
            onPress={() => setLanguageModalVisible(true)}
            style={styles.languageButton}>
            <Text style={styles.languageText}>
              {languages.find(lang => lang.code === i18n.language)?.label || i18n.language}
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.accountContainer}>
        <CustomTitle style={styles.title} title={t('setting_system')} />
        <SettingButton
          style={styles.button}
          title={t('setting_logout')}
          onPress={handleLogout}
        />
      </View>

      {/* Modal chọn ngôn ngữ */}
      <Modal
        visible={languageModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setLanguageModalVisible(false)}>
        <Pressable
          style={styles.modalContainer}
          onPress={() => setLanguageModalVisible(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <FlatList
              data={languages}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleSelectLanguage(item.code)}>
                  <Text style={styles.modalItemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>

    </SafeAreaView>
  );
};

export default SettingPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  title: {
    borderBottomColor: colors.InputBg,
    borderBottomWidth: 1,
    width: '100%',
  },
  button: {
    color: colors.danger,
  },
  accountContainer: {
    marginVertical: 18,
    marginHorizontal: 12,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.InputBg,
    borderRadius: 8,
  },
  languageButton: {
    padding: 12,
  },
  languageText: {
    fontSize: 16,
    color: colors.primaryHover,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: colors.light,
    padding: 16,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    maxHeight: 300,
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.InputBg,
  },
  modalItemText: {
    fontSize: 16,
    color: colors.dark,
  },
});
