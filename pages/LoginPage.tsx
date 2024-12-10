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
} from 'react-native';

import React from 'react';

export default function LoginPage() {
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
        <TextInput style={styles.textInputStyle} placeholder="Username" />
        <TextInput
          secureTextEntry
          style={styles.textInputStyle}
          placeholder="Password"
        />
        <TouchableOpacity style={styles.touchableStyle}>
          <Text>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchableStyle}>
          <Text>Sign in with Google</Text>
        </TouchableOpacity>
        <Text style={styles.signUpText}>Forgot password?</Text>
      </View>
      {/* Footer */}
      <View style={styles.blockContent}>
        <Text>
          Don't have an account?
          <Text style={styles.signUpText}> Sign up</Text>
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
