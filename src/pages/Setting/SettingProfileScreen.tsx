import React, {useEffect, useState} from 'react';
import { ActivityIndicator, StyleSheet, Text, View, TouchableWithoutFeedback, Keyboard} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import {useAppDispatch, useAppSelector} from '@/redux/hooks';
import {userUpdateAPI} from '@/redux/slices/auth/authThunk.ts';
import {getUserByIdAPI} from '@/redux/slices/auth/authThunk.ts';
import {
  selectUser,
  selectIsLoadingUser,
  selectAuthError,
} from '@/redux/selectors';

import { HomeHeader, OverlayBadge, CustomInput, CustomButton } from '@/components'
import { img, colors, showToast, handleAsyncAction, goBack, getStorageString, pickImageFromLibrary} from '@/utils'

const userId = getStorageString('userId') || '';

const SettingProfileScreen = () => {
  const {t, i18n} = useTranslation();
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const [username, setusername] = useState('');
  const [avatar, setavatar] = useState('');
  const [description, setdescription] = useState('');

  const user = useAppSelector(selectUser);
  const isLoadingUser = useAppSelector(selectIsLoadingUser);
  const isErrorUser = useAppSelector(selectAuthError);

  const requestCameraPermission = async () => {
    try {
      const result = await pickImageFromLibrary({ maxWidth: 800, maxHeight: 800 });
      
      if (result) {
        setavatar(result.base64Image);
      }
    } catch (err) {
      console.log('Error selecting image:', err);
      showToast.error(t('error'), t('toast_messages.image_picker_error'));
    }
  };

  const handleUpdateAccount = async () => {
    if (!username || !description || !avatar) {
      showToast.error(t('error'), t('toast_messages.fill_all_fields'));
      return;
    }

    await handleAsyncAction(
      async () => {
        const payload = {
          userId: userId,
          username: username,
          description: description,
          avatar: avatar,
        };

        const resultAction = await dispatch(userUpdateAPI(payload)).unwrap();
        if (!resultAction) {
          throw new Error('Update failed');
        }
      },
      {
        successMessage: t('settings_screen.edit_profile_success'),
        errorMessage: t('settings_screen.edit_profile_error'),
        onSuccess: () => goBack()
      }
    );
  };

  useEffect(() => {
    dispatch(getUserByIdAPI({userId}));
    setusername(user?.username || '');
    setdescription(user?.description || '');
    setavatar(user?.avatar || '');
  }, [dispatch, user?.username, user?.description, user?.avatar]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <HomeHeader
        mode="back"
        title={t('settings_screen.edit_profile_header')}
        showGoBack={true}
        showNotification={false}
        isBackHome={true}
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.body}>
          {isLoadingUser ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : isErrorUser ? (
            <Text>Something went wronggg</Text>
          ) : (
            <View style={styles.avatarContainer}>
              <OverlayBadge
                imageUrl={avatar || img.defaultAvatar}
                onEditPress={() => requestCameraPermission()}
              />
            </View>
          )}
          <View style={styles.formRow}>
            <Text style={styles.label}>{t('settings_screen.user_name')}</Text>
            <CustomInput
              value={username}
              onChangeText={setusername}
              placeholder={t('settings_screen.edit_profile_input_name')}
              style={styles.input}
            />
          </View>
          <View style={styles.formRow}>
            <Text style={styles.label}>{t('settings_screen.email')}</Text>
            <CustomInput
              value={user?.email}
              isDisabled={false}
              style={styles.input}
            />
          </View>
          <View style={styles.formRow}>
            <Text style={styles.label}>{t('settings_screen.description')}</Text>
            <CustomInput
              value={description}
              onChangeText={setdescription}
              placeholder={t('settings_screen.edit_profile_input_description')}
              isDisabled={true}
              style={styles.input}
            />
          </View>
          {/* Thêm các trường khác nếu cần */}
          <View style={styles.buttonRow}>
            <CustomButton
              onPress={handleUpdateAccount}
              title={t('save')}
              style={styles.saveBtn}
            />
            <CustomButton title={t('cancel')} style={styles.cancelBtn} isCancel={true} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default SettingProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  title: {
    fontWeight: 'bold',
    borderBottomColor: colors.dark,
    borderBottomWidth: 1,
    width: '100%',
  },
  body: {
    padding: 18,
    gap: 22,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    backgroundColor: colors.light,
  },
  label: {
    fontSize: 15,
    color: colors.smallText,
    width: 110,
    fontWeight: '400',
    letterSpacing: 0.2,
  },
  input: {
    flex: 1,
    height: 52,
    backgroundColor: colors.InputBg,
    paddingHorizontal: 12,
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
  },
  saveBtn: {
    height: 52,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    marginBottom: 12,
  },
  cancelBtn: {
    height: 52,
    backgroundColor: '#F7F8FA',
    borderColor: colors.InputBg,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 2,
  },
});
