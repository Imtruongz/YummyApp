import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';

import {useNavigation} from '@react-navigation/native';
export default function SignupPage() {
  const navigation: any = useNavigation();

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
        <TextInput style={styles.textInputStyle} placeholder="Username" />
        <TextInput style={styles.textInputStyle} placeholder="Email" />
        <TextInput
          secureTextEntry
          style={styles.textInputStyle}
          placeholder="Password"
        />
        <TextInput
          secureTextEntry
          style={styles.textInputStyle}
          placeholder="Confirm Password"
        />
        <TouchableOpacity style={styles.touchableStyle}>
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
