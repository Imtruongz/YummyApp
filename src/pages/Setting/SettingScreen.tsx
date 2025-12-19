import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, Pressable, Modal, FlatList, TouchableOpacity, Button as RNButton } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../android/types/StackNavType';
import { LoginManager } from 'react-native-fbsdk-next';
import { SafeAreaView } from 'react-native-safe-area-context';
import '../../languages/i18n';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../../languages/i18n';

import { AuthContext } from '@/contexts/AuthContext';
import { HomeHeader, CustomTitle, IconSvg, SettingButton, ConfirmationModal } from '@/components'
import { colors, ImagesSvg, handleAsyncAction, deleteStorageKey } from '@/utils'
interface SettingPageProps
  extends NativeStackScreenProps<RootStackParamList, 'SettingScreen'> { }

const SettingScreen: React.FC<SettingPageProps> = ({ navigation }) => {
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
    await handleAsyncAction(
      async () => {
        LoginManager.logOut();
        deleteStorageKey('accessToken');
        deleteStorageKey('refreshToken');
        deleteStorageKey('userId');
        signOut();
      },
      {
        showSuccessToast: false,
        onError: (error) => console.log('Error during logout:', error)
      }
    );
  };

  const onPressCrashapp = () => {
  }


  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <HomeHeader
        mode="title"
        title={t('settings_screen.setting_settings_header')}
        showNotification={false}
      />
      <View style={styles.accountContainer}>
        <CustomTitle style={styles.title} title={t('settings_screen.setting_account')} />
        <SettingButton
          title={t('settings_screen.setting_profile_setting')}
          targetScreen="SettingProfileScreen"
        />
        <SettingButton
          title={t('settings_screen.setting_Password')}
          targetScreen="ChangePasswordScreen"
        />
        <SettingButton
          title={t('settings_screen.bank_accounts')}
          targetScreen="BankAccountScreen"
        />
        <Pressable style={styles.languageContainer} onPress={() => setLanguageModalVisible(true)}>
          <CustomTitle title={t('settings_screen.setting_language')} />
          <View style={styles.languageButton}>
            <Text style={styles.languageText}>
              {languages.find(lang => lang.code === i18n.language)?.label || i18n.language}
            </Text>
          </View>
        </Pressable>
        <TouchableOpacity
          style={styles.biometricContainer}
          activeOpacity={0.7}
          onPress={onPressCrashapp}
        >
          <View style={styles.biometricContent}>
            <View style={styles.biometricIconContainer}>
              <IconSvg xml={ImagesSvg.icTouchID} width={32} height={32} color='black' />
            </View>
            <View style={styles.biometricTextContainer}>
              <Text style={styles.biometricTitle}>{t('settings_screen.setting_faceid')}</Text>
              <Text style={styles.biometricDescription}>
                {i18n.language === 'vn'
                  ? 'Mở khóa ứng dụng nhanh bằng sinh trắc học'
                  : t('settings_screen.setting_faceid_description')}
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
          title={t('settings_screen.setting_logout')}
          onPress={handleLogout}
        />
      </View>
      <ConfirmationModal
        visible={dialogVisible}
        title={t('settings_screen.setting_logout')}
        message={t('settings_screen.setting_logout_content')}
        type="warning"
        onClose={hideDialog}
        onConfirm={logout}
        confirmText={t('OK')}
        cancelText={t('Cancel')}
      />

      <Modal
        visible={languageModalVisible}
        transparent
        animationType="fade"
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

export default SettingScreen;

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
  biometricContainer: {
    width: '100%',
    backgroundColor: colors.light,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.InputBg,
    shadowColor: colors.dark,
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
    paddingVertical: 22,
    borderBottomWidth: 1,
    borderBottomColor: colors.InputBg,
    paddingHorizontal: 8,
  },
  modalItemText: {
    fontSize: 16,
    color: colors.dark,
  },
});
