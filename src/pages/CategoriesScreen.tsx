import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { HomeHeader, CustomTitle, IconSvg, NoData, CustomInput } from '@/components'
import { colors, ImagesSvg, navigate } from '@/utils'
import { useLoading } from '@/hooks/useLoading';

import { useAppDispatch, useAppSelector } from '../redux/hooks.ts';
import { getFoodByCategoryAPI } from '../redux/slices/food/foodThunk.ts';
import { selectCategoryFoodList, selectIsLoadingFood } from '@/redux/selectors';

interface ListFoodByCategoriesProps {
  route: any;
}

const CategoriesScreen: React.FC<ListFoodByCategoriesProps> = ({
  route,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { categoryId } = route.params;
  const { LoadingShow, LoadingHide } = useLoading();

  const categoryFoodList = useAppSelector(selectCategoryFoodList);
  const isLoadingFood = useAppSelector(selectIsLoadingFood);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (categoryId) {
      dispatch(getFoodByCategoryAPI(categoryId));
    }
  }, [dispatch, categoryId]);

  useEffect(() => {
    if (isLoadingFood) {
      LoadingShow();
    } else {
      LoadingHide();
    }
  }, [isLoadingFood, LoadingShow, LoadingHide]);

  const hasNoData = !categoryFoodList || categoryFoodList.length === 0;

  // Filter food list based on search query
  const filteredFoodList = categoryFoodList?.filter(item =>
    item.foodName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.userDetail?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const showNoSearchResults = searchQuery && filteredFoodList.length === 0;

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <HomeHeader
        mode="back"
        title={t('add_category')}
        showGoBack={true}
        showNotification={false}
        isBackHome={true}
      />
      <CustomInput
        style={styles.inputHeader}
        placeholder={t('search')}
        onChangeText={text => setSearchQuery(text)}
        value={searchQuery}
        showIcon={true}
        iconXml={ImagesSvg.icSearch}
        iconOnLeft={true}
      />

      {isLoadingFood ? null : hasNoData ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <NoData
            message={t('no_data')}
            width={120}
            height={120}
            textSize={16}
          />
        </View>
      ) : showNoSearchResults ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <NoData
            message={t('no_data')}
            width={120}
            height={120}
            textSize={16}
          />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.container2}>
          {filteredFoodList?.map(item => (
            <TouchableOpacity
              key={item.foodId}
              style={styles.itemContainer}
              onPress={() =>
                navigate('FoodDetailScreen', {
                  foodId: item.foodId,
                  userId: item.userId,
                })
              }>
              {/* Top img */}
              <Image style={styles.img} source={{ uri: item.foodThumbnail }} />
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
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <IconSvg xml={ImagesSvg.icStar} width={18} height={18} color={colors.primary} />
                  <Text style={{ color: colors.smallText, fontWeight: 'bold' }}>
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
    height: 52,
    paddingHorizontal: 12,
    margin: 12,
    backgroundColor: colors.light,
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
    shadowOffset: { width: 0, height: 2 },
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
