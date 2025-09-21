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
import Header from '../components/customize/Header';
import { LoginManager } from 'react-native-fbsdk-next';
import { MMKV } from 'react-native-mmkv';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../contexts/AuthContext';

import '../languages/i18n';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../languages/i18n';
import { withCrashlyticsMonitoring } from '../components/withCrashlyticsMonitoring';
import crashlytics from '@react-native-firebase/crashlytics';
import { Dialog, Portal, PaperProvider, Button } from 'react-native-paper'; // Import các thành phần cần thiết

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

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <Header title={t('setting_settings_header')} />
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
        {/* <View>
          <RNButton title="Crash" onPress={() => crashlytics().crash()} />
        </View>
        <View style={{marginTop: 16, marginHorizontal: 16}}>
          <RNButton
            title="Thanh toán qua MBLaos"
            onPress={() => {
              // Tạo token động cho mỗi phiên giao dịch (demo)
              const token = `REF_${Date.now()}_${Math.floor(Math.random()*100000)}`;
              const url = `mblaos://pay?reference=${token}`;
              console.log('Opening URL:', url);
              Linking.openURL(url).catch(() => {
                console.log('MBLaos app is not installed');
              });
            }}
          />
        </View> */}

        <Portal>
          <Dialog visible={dialogVisible} onDismiss={hideDialog}>
            <Dialog.Title>{t('setting_logout')}</Dialog.Title>
            <Dialog.Content>
              <Text>{t('setting_logout_content')}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button textColor={colors.primary} onPress={hideDialog}>{t('Cancel')}</Button>
              <Button textColor={colors.primary} onPress={() => {
                hideDialog();
                logout();
              }}>{t('OK')}</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

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
    </PaperProvider>
  );
};

export default withCrashlyticsMonitoring(SettingPage, 'ProfileScreen');

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
