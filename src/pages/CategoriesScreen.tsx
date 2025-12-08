import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../android/types/StackNavType.ts';
import {useTranslation} from 'react-i18next';

import { HomeHeader, CustomTitle, IconSvg, Loading, NoData } from '@/components'
import {colors, ImagesSvg} from '@/utils'

import {useAppDispatch, useAppSelector} from '../redux/hooks.ts';
import {getFoodByCategoryAPI} from '../redux/slices/food/foodThunk.ts';
import { selectCategoryFoodList, selectIsLoadingFood } from '@/redux/selectors';

interface ListFoodByCategoriesProps
  extends NativeStackScreenProps<
    RootStackParamList,
    'CategoriesScreen'
  > {}
const CategoriesScreen: React.FC<ListFoodByCategoriesProps> = ({
  route,
  navigation,
}) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {categoryId} = route.params;

  const categoryFoodList = useAppSelector(selectCategoryFoodList);
  const isLoadingFood = useAppSelector(selectIsLoadingFood);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Log để debug trạng thái categoryFoodList
  useEffect(() => {
    console.log('CategoriesScreen - categoryFoodList updated:', 
      categoryFoodList ? `${categoryFoodList.length} items` : 'no data');
  }, [categoryFoodList]);
  
  // Bỏ logic lọc dữ liệu, hiển thị toàn bộ categoryFoodList
  useEffect(() => {
    if (categoryId) {
      console.log('CategoriesScreen - Dispatching getFoodByCategoryAPI for categoryId:', categoryId);
      dispatch(getFoodByCategoryAPI(categoryId));
    }
  }, [dispatch, categoryId]);

  if (isLoadingFood) {
    console.log('CategoriesScreen - Loading state');
    return <Loading />;
  }

  // Kiểm tra dữ liệu trống - sử dụng categoryFoodList thay vì filteredCategoryFoodList
  const hasNoData = !categoryFoodList || categoryFoodList.length === 0;

  return (
    <SafeAreaView style={styles.container}  edges={['left', 'right']}>
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
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <NoData 
            message={t('list_nodata')}
            width={120}
            height={120}
            textSize={16}
          />
          <TouchableOpacity 
            style={{
              marginTop: 20, 
              backgroundColor: colors.primary, 
              paddingVertical: 10, 
              paddingHorizontal: 20, 
              borderRadius: 8
            }}
            onPress={() => {
              console.log('Manually refreshing category data');
              if (categoryId) {
                dispatch(getFoodByCategoryAPI(categoryId));
              }
            }}>
            <Text style={{color: 'white'}}>{t('reload')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.container2}>
          {categoryFoodList?.map(item => (
            <TouchableOpacity
              key={item.foodId}
              style={styles.itemContainer}
              onPress={() =>
                navigation.navigate('FoodDetailScreen', {
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
                  <IconSvg xml={ImagesSvg.icStar} width={18} height={18} color={colors.primary} />
                  <Text style={{color: colors.smallText, fontWeight: 'bold'}}>
                    ({(item.averageRating || 0).toFixed(1)})
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

export default CategoriesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
