import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState} from 'react';

import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
// Custom component
import CustomButton from '../components/customize/Button';
import CustomInput from '../components/customize/Input';

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

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const verifyEmail = () => {
    // Email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const verifyPassword = () => {
    return password.length > 6;
  };
  const verifyConfirmPassword = () => {
    if (password === confirmPassword) {
      return true;
    } else {
      return false;
    }
  };

  const handleSignUp = async () => {
    setIsEmailValid(verifyEmail());
    setIsPasswordValid(verifyPassword());
    setIsConfirmPasswordValid(verifyConfirmPassword());
    if (!verifyEmail() || !verifyPassword() || !verifyConfirmPassword()) {
      return;
    }

    try {
      const response = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      console.log('User account created', response);
      response.user.sendEmailVerification();
      navigation.navigate('LoginPage');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');
      }
      if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
      }
      console.log('Error', error);
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
        <CustomButton title="Sign Up" onPress={handleSignUp} />
      </View>
      {/* Footer */}
      <View style={styles.blockContent}>
        <Text>
          Have an account?
          <TouchableOpacity onPress={() => navigation.navigate('LoginPage')}>
            <Text style={styles.signUpText}>Login</Text>
          </TouchableOpacity>
        </Text>
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
  inputIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'grey',
    width: '80%',
  },
  textInputStyle: {
    flex: 1,
    height: 40,
    padding: 10,
  },
  iconInsideInput: {
    padding: 10,
  },
  touchableStyle: {
    width: '80%',
    height: 40,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  imgStyle: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
  },
  signUpText: {
    color: 'orange',
  },
  errorMessage: {
    color: 'red',
  },
});
