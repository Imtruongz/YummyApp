import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState} from 'react';

import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

export default function SignupPage() {
  const navigation: any = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = () => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
        console.log('User account created', user);
        user.user?.sendEmailVerification();
        //Update user profile name
        // user.user?.updateProfile({
        //   displayName: 'User',
        // });
        navigation.navigate('LoginPage');
      });
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
        <TextInput
          value={email}
          keyboardType="email-address"
          onChangeText={setEmail}
          style={styles.textInputStyle}
          placeholder="Email"
        />
        <TextInput
          value={password}
          secureTextEntry
          onChangeText={setPassword}
          style={styles.textInputStyle}
          placeholder="Password"
        />
        <TextInput
          value={confirmPassword}
          secureTextEntry
          onChangeText={setConfirmPassword}
          style={styles.textInputStyle}
          placeholder="Confirm Password"
        />
        <TouchableOpacity onPress={handleSignUp} style={styles.touchableStyle}>
          <Text>Sign Up</Text>
        </TouchableOpacity>
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
  },
  imgStyle: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
  },
  signUpText: {
    color: 'orange',
  },
});
