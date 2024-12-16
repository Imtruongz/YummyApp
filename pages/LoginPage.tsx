import {
  Image,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import React, {useState} from 'react';

import auth from '@react-native-firebase/auth';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../android/types/StackNavType';

//Customm components
import CustomButton from '../components/customize/Button';
import CustomInput from '../components/customize/Input';
import CustomTextFooter from '../components/customize/TextFooter';

interface LoginPageProps
  extends NativeStackScreenProps<RootStackParamList, 'LoginPage'> {}

const LoginPage: React.FC<LoginPageProps> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  const [showPassword, setShowPassword] = useState(false);

  const [isErrorMessage, setIsErrorMessage] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const verifyEmail = () => {
    // Email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const verifyPassword = () => {
    return password.length > 6;
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLoginWithEmail = async () => {
    setIsEmailValid(verifyEmail());
    setIsPasswordValid(verifyPassword());
    if (!verifyEmail() || !verifyPassword()) {
      return;
    }

    try {
      await auth().signInWithEmailAndPassword(email, password);
      navigation.navigate('BottomTabs');
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential') {
        setIsErrorMessage(true);
        setErrorMessage('User not found, please try again');
        console.log('User not found');
      }
    }
  };

  const handleLoginWithGoogle = () => {
    console.log('Google Sign-In');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
            onChangeText={setEmail}
            placeholder="Email"
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
          {isErrorMessage ? (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          ) : null}
          <CustomButton title="Login" onPress={handleLoginWithEmail} />
          <CustomButton
            title="Login with Google"
            onPress={handleLoginWithGoogle}
          />
        </View>
        {/* Footer */}
        <View style={styles.blockContent}>
          <CustomTextFooter
            content="Don't have an account?"
            navigateTo="Signup"
            navigation={navigation}
            targetScreen="SignUpPage"
          />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  blockContent: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 14,
  },
  textInputStyle: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 5,
  },
  touchableStyle: {
    width: '80%',
    height: 40,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
    borderRadius: 5,
    boxShadow: '0.2 0.2 2px black',
  },
  touchableStyleText: {
    fontWeight: 'bold',
  },
  imgStyle: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
  },
  signUpText: {
    color: 'orange',
    fontWeight: 'bold',
  },
  errorMessage: {
    color: 'red',
  },
  blockFooter: {
    flexDirection: 'row',
    gap: 8,
  },
  textFooter: {
    color: 'black',
  },
});

export default LoginPage;
