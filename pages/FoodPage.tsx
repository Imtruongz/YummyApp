import {Text, View} from 'react-native';
import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../android/types/StackNavType';

interface FoodPageProps
  extends NativeStackScreenProps<RootStackParamList, 'FoodPage'> {}
const FoodPage: React.FC<FoodPageProps> = ({route}) => {
  const {content} = route.params;
  return (
    <View>
      <Text>{content}</Text>
      <Text>FoodPage</Text>
    </View>
  );
};

export default FoodPage;
