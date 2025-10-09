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
import {NativeStackScreenProps} from '@react-navigation/native-stack';

const AntDesignIcon = require('react-native-vector-icons/AntDesign').default;
import colors from '../utils/color';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {getFoodByCategoryAPI} from '../redux/slices/food/foodThunk.ts';
import {RootState} from '../redux/store.ts';
import { containsTextCaseInsensitive } from '../utils/regexPatterns';

import {RootStackParamList} from '../../android/types/StackNavType.ts';

import HomeHeader from '../components/HomeHeader';
import CustomTitle from '../components/customize/Title.tsx';
import Loading from '../components/Loading.tsx';
import NoData from '../components/NoData';
import {useTranslation} from 'react-i18next';

interface ListFoodByCategoriesProps
  extends NativeStackScreenProps<
    RootStackParamList,
    'ListFoodByCategoriesPage'
  > {}
const ListFoodByCategoriesPage: React.FC<ListFoodByCategoriesProps> = ({
  route,
  navigation,
}) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {categoryId} = route.params;

  const {categoryFoodList, isLoadingFood} = useAppSelector(
    (state: RootState) => state.food,
  );
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategoryFoodList = categoryFoodList?.filter(
    item => containsTextCaseInsensitive(item.foodName, searchQuery) // Sử dụng hàm từ regexPatterns
  );

  useEffect(() => {
    if (categoryId) {
      dispatch(getFoodByCategoryAPI(categoryId));
    }
  }, [dispatch, categoryId]);

  if (isLoadingFood) {
    return <Loading />;
  }

  // Kiểm tra dữ liệu trống
  const hasNoData = !filteredCategoryFoodList || filteredCategoryFoodList.length === 0;

  return (
    <SafeAreaView style={styles.container}>
      <HomeHeader 
        mode="back" 
        title={t('add_category')} 
        showGoBack={true}
        showNotification={false}
      />
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
          {filteredCategoryFoodList?.map(item => (
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
                <Text style={styles.title2}>{item.userDetail?.username}</Text>
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

export default ListFoodByCategoriesPage;

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
    backgroundColor: colors.InputBg,
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
