import {
  Image,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
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

interface LoginPageProps
  extends NativeStackScreenProps<RootStackParamList, 'LoginPage'> {}

const LoginPage: React.FC<LoginPageProps> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  const [showPassword, setShowPassword] = useState(false);

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
      const response = await auth().signInWithEmailAndPassword(email, password);
      response.user.emailVerified
        ? navigation.navigate('BottomTabs')
        : console.log('Email is not verified');
    } catch (error) {
      console.log('Error', error);
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
          <CustomButton title="Login" onPress={handleLoginWithEmail} />
          <CustomButton
            title="Login with Google"
            onPress={handleLoginWithGoogle}
          />
        </View>
        {/* Footer */}
        <View style={styles.blockContent}>
          <Text>
            Don't have an account?
            <TouchableOpacity onPress={() => navigation.navigate('SignUpPage')}>
              <Text style={styles.signUpText}>Sign Up</Text>
            </TouchableOpacity>
          </Text>
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
    fontWeight: 'bold',
  },
});

export default LoginPage;
