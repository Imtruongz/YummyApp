import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import CustomTitle from '../components/customize/Title';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../android/types/StackNavType';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {getAllFoodAPI} from '../redux/slices/food/foodThunk';
import colors from '../utils/color';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

import Header from '../components/customize/Header';
import NoData from '../components/NoData';
import Loading from '../components/Loading';
import {useTranslation} from 'react-i18next';

interface ListFoodPageProps
  extends NativeStackScreenProps<RootStackParamList, 'ListFoodPage'> {}

const ListFoodPage: React.FC<ListFoodPageProps> = ({navigation}) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();

  const {foodList, isLoadingFood} = useAppSelector(state => state.food);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFoodList = foodList?.filter(
    item => item.foodName.toLowerCase().includes(searchQuery.toLowerCase()), // Lọc theo nameFood
  );

  useEffect(() => {
    dispatch(getAllFoodAPI());
  }, [dispatch]);

  if (isLoadingFood) {
    return <Loading />;
  }

  // Kiểm tra dữ liệu trống
  const hasNoData = !filteredFoodList || filteredFoodList.length === 0;

  return (
    <SafeAreaView style={styles.container}>
      <Header title={t('add_category')} iconName="arrowleft" />
      <TextInput
        style={styles.inputHeader}
        placeholder={t('search')}
        onChangeText={text => setSearchQuery(text)}
      />
      
      {hasNoData ? (
        <NoData 
          message={searchQuery ? t('list_can_not_find') : t('list_nodata')} 
          width={120}
          height={120}
          textSize={16}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.container2}>
          {filteredFoodList?.map(item => (
            <TouchableOpacity
              key={item.foodId}
              style={styles.itemContainer}
              onPress={() =>
                navigation.navigate('RecipeDetailPage', {
                  foodId: item.foodId,
                  userId: item.userId,
                })
              }>
              {/* Top img */}
              <Image style={styles.img} source={{uri: item.foodThumbnail}} />
              {/* Bottom info */}
              <View style={styles.titleItemLeft}>
                <CustomTitle
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.title}
                  title={item.foodName}
                />
                <Text style={styles.title2}>{item.userDetail.username}</Text>
                <View
                  style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                  <AntDesignIcon name="star" size={20} color={colors.primary} />
                  <Text style={{color: colors.smallText, fontWeight: 'bold'}}>
                    (4.0)
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleHeader: {
    padding: 12,
    fontSize: 22,
    fontWeight: 'bold',
  },

  inputHeader: {
    width: '90%',
    backgroundColor: colors.light,
    borderRadius: 12,
    padding: 16,
    margin: 18,
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
    height: 190,
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
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 8,
    gap: 8,
  },
  img: {
    width: 'auto',
    height: 100,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  title2: {
    fontSize: 12,
    color: colors.smallText,
  },
});

export default ListFoodPage;
