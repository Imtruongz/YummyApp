import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import CustomTitle from '../components/customize/Title';

import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../android/types/StackNavType';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {getAllFoodAPI} from '../redux/slices/food/foodThunk';


interface ListFoodPageProps
  extends NativeStackScreenProps<RootStackParamList, 'ListFoodPage'> {}

const ListFoodPage: React.FC<ListFoodPageProps> = ({}) => {
  const dispatch = useAppDispatch();

  const {foodList} = useAppSelector(state => state.food);

  useEffect(() => {
    dispatch(getAllFoodAPI());
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <CustomTitle style={styles.title} title="Recipe" />
      </View>
      <View>
        <FlatList
          data={foodList}
          horizontal={false}
          showsHorizontalScrollIndicator={true}
          keyExtractor={item => item.foodId}
          renderItem={({item}) => (
            <View>
              <Text>{item.foodName}</Text>
            </View>
          )}
        />
        {
          foodList.map((food))
        }
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  icon: {
    padding: 12,
  },
  title: {
    padding: 12,
  },
});

export default ListFoodPage;
