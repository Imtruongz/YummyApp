import {StyleSheet, SafeAreaView, Text, View, Image} from 'react-native';
import React, {useState} from 'react';

import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
// Custom component
import CustomButton from '../components/customize/Button';
import CustomInput from '../components/customize/Input';
import CustomTextFooter from '../components/customize/TextFooter';

import Toast from 'react-native-toast-message';

//utils
import color from '../utils/color';
import {
  verifyEmail,
  verifyPassword,
  verifyConfirmPassword,
} from '../utils/validate';

export default function SignupPage() {
  const navigation: any = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isErrorMessage, setIsErrorMessage] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSignUp = async () => {
    const isValidEmail = verifyEmail(email);
    const isValidPassword = verifyPassword(password);
    const isValidConfirmPassword = verifyConfirmPassword(
      password,
      confirmPassword,
    );

    setIsEmailValid(isValidEmail);
    setIsPasswordValid(isValidPassword);
    setIsConfirmPasswordValid(isValidConfirmPassword);

    if (!isValidEmail || !isValidPassword || !isValidConfirmPassword) {
      return;
    }

    try {
      const response = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      console.log('User account created', response);
      Toast.show({
        type: 'success',
        text1: 'Sign up successfully',
        text2: 'Please check your email to verify your account',
      });
      response.user.sendEmailVerification();
      navigation.navigate('LoginPage');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setIsErrorMessage(true);
        setErrorMessage('That email address is already in use!');
        console.log('That email address is already in use!');
        return {errorMessage};
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
        {!isEmailValid ? (
          <Text style={styles.errorMessage}>Email invalidd</Text>
        ) : null}
        <CustomInput
          value={password}
          placeholder="Password"
          secureTextEntry={!showPassword}
          onChangeText={setPassword}
          showIcon={true}
          onPressIcon={handleShowPassword}
          iconName={showPassword ? 'eye' : 'eyeo'}
        />
        {isPasswordValid ? null : (
          <Text style={styles.errorMessage}>Password invalid</Text>
        )}
        <CustomInput
          value={confirmPassword}
          placeholder="Confirm Password"
          secureTextEntry={!showConfirmPassword}
          onChangeText={setConfirmPassword}
          showIcon={true}
          onPressIcon={handleShowConfirmPassword}
          iconName={showConfirmPassword ? 'eye' : 'eyeo'}
        />

        {isConfirmPasswordValid ? null : (
          <Text style={styles.errorMessage}>Confirmation password invalid</Text>
        )}
        {
          // Error message
          isErrorMessage ? (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          ) : null
        }
        <CustomButton title="Sign Up" onPress={handleSignUp} />
      </View>
      {/* Footer */}
      <View style={styles.blockContent}>
        <CustomTextFooter
          content="Already have an account?"
          navigateTo="Login"
          navigation={navigation}
          targetScreen="LoginPage"
        />
      </View>
    </SafeAreaView>
  );
}
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
    color: color.danger,
  },
});
