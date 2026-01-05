import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CustomButton } from '@/components';
import { colors, goBack, navigate, showToast, handleAsyncAction } from '@/utils';
import { useAppDispatch } from '@/redux/hooks';
import { AuthStackParamList } from '@/navigation/types';
import { forgotPasswordAPI } from '@/redux/slices/auth/authThunk';
import { useLoading } from '@/hooks/useLoading';

interface ForgotPasswordPageProps
  extends NativeStackScreenProps<AuthStackParamList, 'ForgotPasswordPage'> {}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { LoadingShow, LoadingHide } = useLoading();

  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ email?: string }>({});

  // Validate email
  const validateEmail = (emailValue: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  const handleSendCode = async () => {
    Keyboard.dismiss();
    const newErrors: { email?: string } = {};

    // Validate
    if (!email.trim()) {
      newErrors.email = t('forgot_password_screen.error_email_required');
    } else if (!validateEmail(email)) {
      newErrors.email = t('forgot_password_screen.error_invalid_email');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    LoadingShow();
    await handleAsyncAction(
      async () => {
        const resultAction = await dispatch(
          forgotPasswordAPI({ email: email.trim() })
        );

        if (!forgotPasswordAPI.fulfilled.match(resultAction)) {
          const errorMsg = (resultAction.payload as string) || 'Failed to send verification code';
          throw new Error(errorMsg);
        }

        // Success - navigate to verify screen
        navigate('VerifyEmailScreen', { email: email.trim(), flowType: 'forgotPassword' });
      },
      {
        onSuccess: () => {
          LoadingHide();
          showToast.success(t('forgot_password_screen.code_sent_success'));
        },
        onError: (error) => {
          LoadingHide();
          const errorMsg = error?.message || 'Failed to send code';
          showToast.error(t('error'), errorMsg);
        },
      }
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>← {t('back_button')}</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {t('forgot_password_screen.forgot_pw_header')}
            </Text>
            <Text style={styles.subtitle}>
              {t('forgot_password_screen.forgot_pw_subtitle')}
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Email Input */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                {t('forgot_password_screen.forgot_pw_email')}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  errors.email && styles.inputError,
                ]}
                placeholder={t('forgot_password_screen.email_placeholder')}
                placeholderTextColor={colors.smallText}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) {
                    setErrors({ ...errors, email: undefined });
                  }
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={true}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            {/* Info Box */}
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                📧 {t('forgot_password_screen.info_message')}
              </Text>
            </View>

            {/* Send Code Button */}
            <CustomButton
              title={t('forgot_password_screen.forgot_pw_btn')}
              onPress={handleSendCode}
              disabled={!email}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {t('forgot_password_screen.remember_password')}{' '}
              <Text
                style={styles.linkText}
                onPress={() => navigate('LoginScreen')}
              >
                {t('forgot_password_screen.login_link')}
              </Text>
            </Text>
          </View>
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
  backButton: {
    padding: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.primaryText,
    textAlign: 'center',
    lineHeight: 20,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    gap: 20,
  },
  formGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 14,
    color: colors.dark,
  },
  inputError: {
    borderColor: colors.danger,
    backgroundColor: '#ffebee',
  },
  errorText: {
    fontSize: 12,
    color: colors.danger,
    marginTop: 4,
  },
  infoBox: {
    backgroundColor: '#fff3cd',
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  infoText: {
    fontSize: 13,
    color: '#856404',
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: colors.primaryText,
    textAlign: 'center',
  },
  linkText: {
    color: colors.primary,
    fontWeight: '600',
  },
});

export default ForgotPasswordPage;
