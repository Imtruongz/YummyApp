import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback, Keyboard, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { userUpdateAPI } from '@/redux/slices/auth/authThunk.ts';
import { getUserByIdAPI } from '@/redux/slices/auth/authThunk.ts';
import {
  selectUser,
  selectIsLoadingUser,
  selectAuthError,
} from '@/redux/selectors';
import { useLoading } from '@/hooks/useLoading';

import { HomeHeader, OverlayBadge, CustomInput, CustomButton, SettingHeaderCard, SettingFormCard, SettingFormGroup, SettingInfoCard, SettingDivider } from '@/components'
import { img, colors, showToast, handleAsyncAction, goBack, pickImageFromLibrary, ImagesSvg } from '@/utils'

const SettingProfileScreen = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const { LoadingShow, LoadingHide } = useLoading();
  const navigation = useNavigation();
  const [username, setusername] = useState('');
  const [avatar, setavatar] = useState('');
  const [description, setdescription] = useState('');

  const user = useAppSelector(selectUser);
  const isLoadingUser = useAppSelector(selectIsLoadingUser);
  const isErrorUser = useAppSelector(selectAuthError);

  useEffect(() => {
    if (isLoadingUser) {
      LoadingShow();
    } else {
      LoadingHide();
    }
  }, [isLoadingUser, LoadingShow, LoadingHide]);

  // ✅ Initialize form with current user data
  useEffect(() => {
    if (user) {
      setusername(user.username || '');
      setdescription(user.description || '');
      setavatar(user.avatar || '');
    }
  }, [user]);

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
    if (!username) {
      showToast.error(t('error'), t('settings_screen.fill_all_fields'));
      return;
    }

    LoadingShow();
    await handleAsyncAction(
      async () => {
        const payload = {
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
        onSuccess: () => {
          showToast.success(t('success'), t('setting_profile_screen.edit_profile_success'));
          LoadingHide();
          goBack();
        },
        onError: () => {
          showToast.error(t('error'), t('setting_profile_screen.edit_profile_error'));
          LoadingHide();
        }
      }
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <HomeHeader
        mode="back"
        title={t('setting_profile_screen.edit_profile_header')}
        showGoBack={true}
        showNotification={false}
        isBackHome={true}
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Card */}
          <SettingHeaderCard
            icon={ImagesSvg.icUser}
            title={t('setting_profile_screen.edit_profile_header')}
            subtitle={t('setting_profile_screen.edit_profile_description')}
            iconSize={18}
          />

          {/* Avatar Section */}
          <View style={styles.avatarCard}>
            {isErrorUser ? (
              <Text style={styles.errorText}>{t('general_error')}</Text>
            ) : (
              <TouchableOpacity
                style={styles.avatarContainer}
                onPress={requestCameraPermission}
              >
                <OverlayBadge
                  imageUrl={avatar || img.defaultAvatar}
                  onEditPress={() => (console.log('Edit Avatar Pressed'))}
                />
                <Text style={styles.avatarHint}>{t('setting_profile_screen.tap_to_edit_avatar')}</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Form Card */}
          <SettingFormCard>
            {/* Username */}
            <SettingFormGroup
              label={t('setting_profile_screen.user_name')}
              icon={ImagesSvg.icUser}
              iconSize={16}
            >
              <CustomInput
                value={username}
                onChangeText={setusername}
                placeholder={t('setting_profile_screen.edit_profile_input_name')}
                style={styles.input}
              />
            </SettingFormGroup>

            <SettingDivider />

            {/* Email */}
            <SettingFormGroup
              label={t('setting_profile_screen.email')}
              icon={ImagesSvg.icEmail}
              iconSize={22}
              helper={t('setting_profile_screen.email_cannot_change')}
            >
              <CustomInput
                value={user?.email}
                isDisabled={false}
                style={[styles.input, styles.disabledInput]}
              />
            </SettingFormGroup>

            <SettingDivider />

            {/* Description */}
            <SettingFormGroup
              label={t('setting_profile_screen.description')}
              icon={ImagesSvg.icEdit}
              iconSize={22}
            >
              <CustomInput
                value={description}
                onChangeText={setdescription}
                placeholder={t('setting_profile_screen.edit_profile_input_description')}
                style={[styles.input, styles.descriptionInput]}
                multiline={true}
                numberOfLines={3}
              />
              <Text style={styles.charCount}>{t('setting_profile_screen.char_count', { count: description.length })}</Text>
            </SettingFormGroup>
          </SettingFormCard>

          {/* Info Card */}
          <SettingInfoCard
            icon={ImagesSvg.icInfo}
            title={t('setting_profile_screen.profile_info')}
            items={[
              t('setting_profile_screen.complete_profile'),
              t('setting_profile_screen.profile_visibility'),
              t('setting_profile_screen.save_changes'),
            ]}
          />

          <View style={{ height: 20 }} />
        </ScrollView>
      </TouchableWithoutFeedback>

      {/* Sticky Button Bar */}
      <View style={styles.buttonContainer}>
        <CustomButton
          onPress={handleUpdateAccount}
          title={t('save')}
          style={styles.saveBtn}
        />
        <CustomButton
          title={t('cancel')}
          style={styles.cancelBtn}
          isCancel={true}
        />
      </View>
    </SafeAreaView>
  );
};

export default SettingProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerCard: {
    backgroundColor: colors.primary + '15',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.smallText,
    lineHeight: 20,
  },
  avatarCard: {
    backgroundColor: colors.light,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 24,
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  avatarHint: {
    fontSize: 13,
    color: colors.smallText,
    marginTop: 8,
  },
  input: {
    height: 50,
    backgroundColor: colors.InputBg,
    paddingHorizontal: 14,
    borderRadius: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
    color: colors.smallText,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
    paddingBottom: 12,
  },
  charCount: {
    color: colors.smallText,
    fontSize: 12,
    marginTop: 8,
    textAlign: 'right',
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 20,
    backgroundColor: 'transparent',
    gap: 12,
  },
  saveBtn: {
    flex: 1,
    height: 52,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  cancelBtn: {
    flex: 1,
    height: 52,
    backgroundColor: '#F7F8FA',
    borderColor: colors.InputBg,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
});
