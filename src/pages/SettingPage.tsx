import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Modal,
  FlatList,
  TouchableOpacity,
  Button as RNButton, // Để tránh trùng lặp với 'Button' của paper
  Linking,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../android/types/StackNavType';
import CustomTitle from '../components/customize/Title';
import SettingButton from '../components/customize/SettingButton';
import colors from '../utils/color';
import HomeHeader from '../components/HomeHeader';
import { LoginManager } from 'react-native-fbsdk-next';
import { MMKV } from 'react-native-mmkv';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../contexts/AuthContext';
import ConfirmationModal from '../components/common/ConfirmationModal';

import '../languages/i18n';
import crashlytics from '@react-native-firebase/crashlytics';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../languages/i18n';
import api from '../api/config'
const EntypoIcon = require('react-native-vector-icons/Entypo').default;

const storage = new MMKV();
interface SettingPageProps
  extends NativeStackScreenProps<RootStackParamList, 'SettingPage'> { }

const SettingPage: React.FC<SettingPageProps> = ({ navigation }) => {
  const { signOut } = useContext(AuthContext);
  const { t, i18n } = useTranslation();

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'vn', label: 'Tiếng Việt' },
    { code: 'zh', label: '简体中文' }
  ];

  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);

  const handleSelectLanguage = async (lang: string) => {
    setLanguageModalVisible(false);
    await changeLanguage(lang);
    console.log('Language changed to:', i18n.language);
  };

  const handleLogout = () => {
    setDialogVisible(true);
  };

  const hideDialog = () => setDialogVisible(false);

  const logout = async () => {
    try {
      LoginManager.logOut();
      storage.delete('accessToken');
      storage.delete('refreshToken');
      storage.delete('userId');
      signOut();
    } catch (exception) {
      console.error('Error during logout:', exception);
    }
  };

  const onPressCrashapp = () => {
    // Crash app để test firebase crashlytics
    crashlytics().crash();
  }


  return (
      <SafeAreaView style={styles.container}>
        <HomeHeader mode="title" title={t('setting_settings_header')} showNotification={false} />
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
          <SettingButton
            title={t('bank_accounts')}
            navigation={navigation}
            targetScreen="BankAccountScreen"
          />
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
          <TouchableOpacity
            style={styles.biometricContainer}
            activeOpacity={0.7}
            onPress={onPressCrashapp}
            >
            <View style={styles.biometricContent}>
              <View style={styles.biometricIconContainer}>
                <EntypoIcon name="fingerprint" size={24} color={colors.primary} />
              </View>
              <View style={styles.biometricTextContainer}>
                <Text style={styles.biometricTitle}>{t('setting_faceid')}</Text>
                <Text style={styles.biometricDescription}>
                  {i18n.language === 'vn'
                    ? 'Mở khóa ứng dụng nhanh bằng sinh trắc học'
                    : 'Quickly unlock app with biometrics'}
                </Text>
              </View>
              <View style={styles.switchContainer}>
                <View style={styles.biometricSwitch}>
                  <View style={styles.switchKnob} />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.accountContainer}>
          <SettingButton
            style={styles.button}
            title={t('setting_logout')}
            onPress={handleLogout}
          />
        </View>
        <ConfirmationModal
          visible={dialogVisible}
          title={t('setting_logout')}
          message={t('setting_logout_content')}
          type="warning"
          onClose={hideDialog}
          onConfirm={logout}
          confirmText={t('OK')}
          cancelText={t('Cancel')}
        />

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
  // Face ID / Biometric Styles
  biometricContainer: {
    width: '100%',
    backgroundColor: colors.light,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.InputBg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  biometricContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  biometricIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '20', // 20% opacity
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  biometricIcon: {
    fontSize: 18,
  },
  biometricTextContainer: {
    flex: 1,
  },
  biometricTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 4,
  },
  biometricDescription: {
    fontSize: 13,
    color: colors.smallText,
  },
  switchContainer: {
    marginLeft: 8,
  },
  biometricSwitch: {
    width: 48,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  switchKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.light,
    alignSelf: 'flex-end',
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
