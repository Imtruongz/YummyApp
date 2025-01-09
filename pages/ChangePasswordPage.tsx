import {StyleSheet, Text, View, Button, Alert} from 'react-native';
import React, {useState} from 'react';
import CustomInput from '../components/customize/Input';
import {changePasswordAPI} from '../redux/slices/auth/authThunk';
import {useAppDispatch} from '../redux/hooks';

import {MMKV} from 'react-native-mmkv';
const storage = new MMKV();

const userId = storage.getString('userId') || '';

const ChangePasswordPage = () => {
  const dispatch = useAppDispatch();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match!');
      return;
    }

    try {
      const payload = {
        userId: userId,
        oldPassword: oldPassword,
        newPassword: newPassword,
      };

      await dispatch(changePasswordAPI(payload)).unwrap();
      Alert.alert('Success', 'Password successfully changed!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to change password.');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Change Password Page</Text>
      <CustomInput
        placeholder="Old Password"
        value={oldPassword}
        secureTextEntry
        onChangeText={setOldPassword}
      />
      <CustomInput
        placeholder="New Password"
        value={newPassword}
        secureTextEntry
        onChangeText={setNewPassword}
      />
      <CustomInput
        placeholder="Confirm Password"
        value={confirmPassword}
        secureTextEntry
        onChangeText={setConfirmPassword}
      />
      <Button title="Change Password" onPress={handleChangePassword} />
    </View>
  );
};

export default ChangePasswordPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
});
