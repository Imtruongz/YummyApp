import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import CustomTitle from '../components/customize/Title';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../android/types/StackNavType';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {getAllFoodAPI} from '../redux/slices/food/foodThunk';
import colors from '../utils/color';
import CustomAvatar from '../components/customize/Avatar';

interface ListFoodPageProps
  extends NativeStackScreenProps<RootStackParamList, 'ListFoodPage'> {}

const ListFoodPage: React.FC<ListFoodPageProps> = ({navigation}) => {
  const dispatch = useAppDispatch();

  const {foodList} = useAppSelector(state => state.food);

  useEffect(() => {
    dispatch(getAllFoodAPI());
  }, [dispatch]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <CustomTitle style={styles.titleHeader} title="Recipe" />
        <TextInput style={styles.inputHeader} placeholder="Search" />
      </View>
      <ScrollView contentContainerStyle={styles.container2}>
        {foodList?.map(item => (
          <TouchableOpacity
            key={item.foodId}
            style={styles.itemContainer}
            onPress={() =>
              navigation.navigate('RecipeDetailPage', {foodId: item.foodId})
            }>
            {/* Top img */}
            <Image style={styles.img} source={{uri: item.foodThumbnail}} />
            {/* Bottom info */}
            <View style={styles.titleItemLeft}>
              <CustomTitle style={styles.title} title={item.foodName} />
              <CustomAvatar
                style={styles.avatar}
                image={item.userDetail?.avatar}
              />
              <Text>by: {item.userDetail?.username}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
    flexDirection: 'column',
  },
  icon: {
    padding: 12,
  },

  avatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    margin: 8,
  },

  titleHeader: {
    padding: 12,
    fontSize: 24,
    fontWeight: 'bold',
  },

  inputHeader: {
    width: '90%',
    height: 40,
    backgroundColor: colors.light,
    borderRadius: 12,
    padding: 8,
    paddingHorizontal: 16,
    margin: 8,
  },

  container2: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 14,
    padding: 12,
  },
  itemContainer: {
    width: '47%',
    height: 180,
    backgroundColor: colors.light,
    borderRadius: 15,
    gap: 8,
    shadowColor: colors.dark,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  titleItemLeft: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: 'auto',
    height: 100,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ListFoodPage;
