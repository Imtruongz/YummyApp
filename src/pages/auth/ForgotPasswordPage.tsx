import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  SafeAreaView
} from 'react-native';
import React, {useState} from 'react';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../android/types/StackNavType.ts';
import color from '../../utils/color.ts';
import img from '../../utils/urlImg.ts';
import { useTranslation } from 'react-i18next';

import CustomInput from '../../components/customize/CustomInput.tsx';
import CustomButton from '../../components/customize/CustomButton.tsx';
import AuthFooter from './component/AuthFooter.tsx';
import AuthHeader from './component/AuthHeader.tsx';

interface ForgotPasswordPageProps
  extends NativeStackScreenProps<RootStackParamList, 'ForgotPasswordPage'> {}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({
  navigation,
}) => {
    const { t, i18n } = useTranslation();
  
  const [email, setEmail] = useState('');
  const [isErrorMessage, setIsErrorMessage] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const handleResetPassword = async () => {
    try {
      setIsErrorMessage(false);
      setErrorMessage('Email sent, please check your email');
    } catch (error: any) {
      console.log(error);
      if (error.code === 'auth/invalid-email') {
        setIsErrorMessage(true);
        setErrorMessage('Invalid email');
      }
      if (error.code === 'auth/invalid-credential') {
        setIsErrorMessage(true);
        setErrorMessage('User not found, please try again');
      }
    }
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
            placeholder={t('login_email')}
            onChangeText={setEmail}
          />
          {isErrorMessage ? (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          ) : (
            <Text style={styles.sentEmailMessage}>{errorMessage}</Text>
          )}
          <CustomButton title={t('login_send_mail')} onPress={handleResetPassword} />
          <AuthFooter
            content="Back to"
            navigateTo="Login"
            navigation={navigation}
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
    backgroundColor: color.light,
  },
  body: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 16,
  },
  errorMessage: {
    color: color.danger,
  },
  sentEmailMessage: {
    color: color.success,
  },
});

export default ForgotPasswordPage;
