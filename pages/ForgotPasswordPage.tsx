import {
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useState} from 'react';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../android/types/StackNavType';

import CustomInput from '../components/customize/Input';
import CustomButton from '../components/customize/Button';
import CustomTextFooter from '../components/customize/TextFooter';
import CustomAuthHeader from '../components/customize/authHeader';

import color from '../utils/color';
import auth from '@react-native-firebase/auth';
import img from '../utils/urlImg.ts';

interface ForgotPasswordPageProps
  extends NativeStackScreenProps<RootStackParamList, 'ForgotPasswordPage'> {}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({
  navigation,
}) => {
  const [email, setEmail] = useState('');
  const [isErrorMessage, setIsErrorMessage] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const handleResetPassword = async () => {
    try {
      await auth().sendPasswordResetEmail(email);
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
        <CustomAuthHeader img={img.Yummy} />
        {/* Content */}
        <View style={styles.body}>
          <CustomInput
            value={email}
            placeholder="Email"
            onChangeText={setEmail}
          />
          {isErrorMessage ? (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          ) : (
            <Text style={styles.sentEmailMessage}>{errorMessage}</Text>
          )}
          <CustomButton title="Send mail" onPress={handleResetPassword} />
          <CustomTextFooter
            content="Back to"
            navigateTo="Login"
            navigation={navigation}
            targetScreen="LoginPage"
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
