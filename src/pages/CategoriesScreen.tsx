import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { HomeHeader, CustomTitle, IconSvg, NoData, CustomInput, FoodItemCard } from '@/components'
import { colors, ImagesSvg } from '@/utils'
import { useLoading } from '@/hooks/useLoading';

import { useAppDispatch, useAppSelector } from '../redux/hooks.ts';
import { getFoodByCategoryAPI } from '../redux/slices/food/foodThunk.ts';
import { selectCategoryFoodList, selectIsLoadingFood } from '@/redux/selectors';

interface ListFoodByCategoriesProps {
  route: any;
  navigation: any;
}

const CategoriesScreen: React.FC<ListFoodByCategoriesProps> = ({
  route,
  navigation,
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
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={t('search')}
          placeholderTextColor={colors.smallText}
          onChangeText={text => setSearchQuery(text)}
          value={searchQuery}
        />
        <TouchableOpacity style={styles.searchButton} activeOpacity={0.8}>
          <IconSvg xml={ImagesSvg.icSearch} width={20} height={20} color="#fff" />
        </TouchableOpacity>
      </View>

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
        <FlatList
          data={filteredFoodList}
          renderItem={({ item, index }) => (
            <FoodItemCard
              item={item}
              index={index}
              showRating={true}
              onPress={() =>
                navigation.navigate('FoodDetailScreen', {
                  foodId: item.foodId,
                  userId: item.userId,
                })
              }
              containerStyle={{ width: '47%' }}
            />
          )}
          keyExtractor={(item, index) => `${item.foodId}_${index}`}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
};

export default CategoriesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30, // Pill shape
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 8,
    paddingVertical: 6,
    // Shadow for elevation effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f5f5f5',
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 12,
    fontSize: 15,
    color: colors.dark,
    fontWeight: '500',
  },
  searchButton: {
    width: 40,
    height: 40,
    backgroundColor: colors.primary,
    borderRadius: 20, // Circle shape
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  listContainer: {
    width: '100%',
    padding: 12,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: 14,
  },
});
