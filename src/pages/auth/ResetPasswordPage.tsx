import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../android/types/StackNavType';
import { CustomButton, CustomInput } from '@/components';
import { colors, goBack, navigate, showToast, ImagesSvg } from '@/utils';
import { useAppDispatch } from '@/redux/hooks';
import { resetPasswordAPI } from '@/redux/slices/auth/authThunk';
import { useLoading } from '@/hooks/useLoading';

interface ResetPasswordPageProps
  extends NativeStackScreenProps<RootStackParamList, 'ResetPasswordPage'> { }

interface Errors {
  newPassword?: string;
  confirmPassword?: string;
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ route }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { LoadingShow, LoadingHide } = useLoading();

  const { email, verificationCode } = route.params || {};

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const handleShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validatePasswords = (): boolean => {
    const newErrors: Errors = {};

    if (!newPassword) {
      newErrors.newPassword = t('reset_password_screen.error_password_required');
    } else if (newPassword.length < 6) {
      newErrors.newPassword = t('reset_password_screen.error_password_min');
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = t('reset_password_screen.error_confirm_required');
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = t('reset_password_screen.error_password_mismatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = async () => {
    Keyboard.dismiss();

    if (!validatePasswords()) {
      return;
    }

    LoadingShow();
    try {
      const resultAction = await dispatch(
        resetPasswordAPI({
          email: email || '',
          verificationCode: verificationCode || '',
          newPassword,
        })
      );

      if (!resetPasswordAPI.fulfilled.match(resultAction)) {
        throw new Error('Failed to reset password');
      }

      showToast.success(t('reset_password_screen.reset_pw_success'));
      setTimeout(() => {
        navigate('LoginScreen');
      }, 1500);
    } catch (error: any) {
      showToast.error(error?.message || 'Failed to reset password');
    } finally {
      LoadingHide();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {t('reset_password_screen.reset_pw_header')}
            </Text>
            <Text style={styles.subtitle}>
              {t('reset_password_screen.reset_pw_description')}
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            {/* New Password */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                {t('reset_password_screen.reset_new_pw')}
              </Text>
              <CustomInput
                style={[
                  styles.input,
                  errors.newPassword && styles.inputError]}
                placeholder={t('reset_password_screen.new_pw_placeholder')}
                value={newPassword}
                onChangeText={(text) => {
                  setNewPassword(text);
                  if (errors.newPassword) {
                    setErrors({ ...errors, newPassword: undefined });
                  }
                }}
                secureTextEntry={!showNewPassword}
                showIcon={true}
                onPressIcon={handleShowNewPassword}
                iconXml={showNewPassword ? ImagesSvg.eye : ImagesSvg.hideEye}
              />
              {errors.newPassword && (
                <Text style={styles.errorText}>{errors.newPassword}</Text>
              )}
            </View>

            {/* Confirm Password */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                {t('reset_password_screen.reset_confirm_pw')}
              </Text>
              <CustomInput
                style={[
                  styles.input,
                  errors.confirmPassword && styles.inputError,
                ]}
                placeholder={t('reset_password_screen.confirm_pw_placeholder')}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword) {
                    setErrors({ ...errors, confirmPassword: undefined });
                  }
                }}
                secureTextEntry={!showConfirmPassword}
                showIcon={true}
                onPressIcon={handleShowConfirmPassword}
                iconXml={showConfirmPassword ? ImagesSvg.eye : ImagesSvg.hideEye}
              />
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Reset Button */}
            <CustomButton
              title={t('reset_password_screen.reset_pw_btn')}
              onPress={handleResetPassword}
              disabled={!newPassword || !confirmPassword}
            />
          </View>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>
              {t('reset_password_screen.password_requirement')}
            </Text>
            <Text style={styles.infoBullet}>
              • {t('reset_password_screen.pw_req_1')}
            </Text>
            <Text style={styles.infoBullet}>
              • {t('reset_password_screen.pw_req_2')}
            </Text>
            <Text style={styles.infoBullet}>
              • {t('reset_password_screen.pw_req_3')}
            </Text>
          </View>

          <View style={styles.spacer} />
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.primaryText,
    textAlign: 'center',
    lineHeight: 20,
  },
  formCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 8,
  },
  inputError: {
    borderColor: colors.danger,
    backgroundColor: '#ffebee',
  },
  errorText: {
    fontSize: 12,
    color: colors.danger,
    marginTop: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 16,
  },
  infoCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#fff8e1',
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#f57f17',
    marginBottom: 8,
  },
  infoBullet: {
    fontSize: 12,
    color: '#f57f17',
    marginBottom: 4,
    lineHeight: 16,
  },
  spacer: {
    height: 20,
  },
  input: {
    height: 52,
    backgroundColor: colors.light,
    paddingHorizontal: 12,
  },
});

export default ResetPasswordPage;
