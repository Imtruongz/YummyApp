import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
  Button,
} from 'react-native';

import React, {useState} from 'react';

import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

export default function LoginPage() {
  const navigation: any = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginWithEmail = () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(user => {
        console.log('User account signed in!', user);
        navigation.navigate('BottomTabs');
      });
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
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={styles.textInputStyle}
            placeholder="Username"
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.textInputStyle}
            placeholder="Password"
          />
          <TouchableOpacity
            onPress={handleLoginWithEmail}
            style={styles.touchableStyle}>
            <Text>Login</Text>
          </TouchableOpacity>
          <Button
            title="Google Sign-In"
            onPress={() => handleLoginWithGoogle}
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
