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
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export default function LoginPage() {
  const navigation: any = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function onGoogleButtonPress() {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const signInResult = await GoogleSignin.signIn();
  
    // Try the new style of google-sign in result, from v13+ of that module
    idToken = signInResult.data?.idToken;
    if (!idToken) {
      // if you are using older versions of google-signin, try old style result
      idToken = signInResult.idToken;
    }
    if (!idToken) {
      throw new Error('No ID token found');
    }
  
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(signInResult.data.token);
  
    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }

  const handleLoginWithEmail = (email: string, password: string) => {
    auth().
  }


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
            keyboardType='email-address'
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
            onPress={() => navigation.navigate('BottomTabs')}
            style={styles.touchableStyle}>
            <Text>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.touchableStyle}>
            <Text>Sign in with Google</Text>
          </TouchableOpacity>
          <Button
            title="Google Sign-In"
            onPress={() =>
              onGoogleButtonPress().then(() =>
                console.log('Signed in with Google!'),
              )
            }
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
