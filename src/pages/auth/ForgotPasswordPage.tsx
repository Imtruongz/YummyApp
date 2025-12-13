import React, {useState} from 'react';
import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View, SafeAreaView} from 'react-native';

import { useTranslation } from 'react-i18next';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../android/types/StackNavType.ts';
import { colors, img, showToast, handleAsyncAction } from '@/utils'
import { CustomInput, CustomButton } from '@/components'
import AuthFooter from './component/AuthFooter.tsx';
import AuthHeader from './component/AuthHeader.tsx';

interface ForgotPasswordPageProps
  extends NativeStackScreenProps<RootStackParamList, 'ForgotPasswordPage'> {}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = () => {
    const { t, i18n } = useTranslation();
  
  const [email, setEmail] = useState('');
  const [isErrorMessage, setIsErrorMessage] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const handleResetPassword = async () => {
    if (!email) {
      setIsErrorMessage(true);
      setErrorMessage('Please enter your email address');
      return;
    }

    await handleAsyncAction(
      async () => {
        // Placeholder for actual API call
        console.log('Reset password for:', email);
        setIsErrorMessage(false);
        setErrorMessage('Email sent, please check your email');
      },
      {
        successMessage: 'Reset email sent',
        errorMessage: 'Failed to send reset email',
        showSuccessToast: false
      }
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        {/* Title */}
        <AuthHeader img={img.Yummy} />
        {/* Content */}
        <View style={styles.body}>
          <CustomInput
            value={email}
            placeholder={t('login_screen.login_email')}
            onChangeText={setEmail}
            style={styles.input}
          />
          {isErrorMessage ? (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          ) : (
            <Text style={styles.sentEmailMessage}>{errorMessage}</Text>
          )}
          <CustomButton title={t('login_screen.login_send_mail')} onPress={handleResetPassword} />
          <AuthFooter
            content="Back to"
            navigateTo="Login"
            targetScreen="LoginScreen"
          />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  body: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 16,
  },
  errorMessage: {
    color: colors.danger,
  },
  sentEmailMessage: {
    color: colors.success,
  },
  input: {
    height: 52,
    backgroundColor: colors.light,
    paddingHorizontal: 12,
    margin: 12,
  },
});

export default ForgotPasswordPage;
