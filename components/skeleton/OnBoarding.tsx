import {Button, Text, View} from 'react-native';
import React from 'react';
import {RootStackParamList} from '../../android/types/StackNavType';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useAppState} from '../../contexts/app-state';

interface OnBoardingProps
  extends NativeStackScreenProps<RootStackParamList, 'OnBoarding'> {}
const OnBoarding: React.FC<OnBoardingProps> = ({}) => {
  const {onChangeAppState} = useAppState();
  const handleMoveToLogin = () => {
    onChangeAppState();
  };
  return (
    <View>
      <Text>OnBoarding</Text>
      <Button title="Login" onPress={() => handleMoveToLogin()} />
    </View>
  );
};

export default OnBoarding;
