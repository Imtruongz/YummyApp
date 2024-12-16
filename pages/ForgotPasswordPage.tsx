import {Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../android/types/StackNavType';
import auth from '@react-native-firebase/auth';

import CustomInput from '../components/customize/Input';
import CustomButton from '../components/customize/Button';
import CustomTextFooter from '../components/customize/TextFooter';

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
    <SafeAreaView style={styles.blockContent}>
      {/* Title */}
      <View style={styles.blockContent}>
        <Image
          style={styles.imgStyle}
          source={require('../assets/Logo.webp')}
        />
      </View>
      {/* Content */}
      <View style={styles.blockContent}>
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
  );
};
const styles = StyleSheet.create({
  blockContent: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 8,
  },
  imgStyle: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
  },
  errorMessage: {
    color: 'red',
  },
  sentEmailMessage: {
    color: 'green',
  },
});

export default ForgotPasswordPage;
