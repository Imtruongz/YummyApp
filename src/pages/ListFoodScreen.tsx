import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getAllFoodAPI, searchFoodAPI } from '@/redux/slices/food/foodThunk';
import { selectFoodList, selectSearchFoodList, selectIsLoadingFood } from '@/redux/selectors';

import { HomeHeader, CustomTitle, IconSvg, NoData, CustomInput, FoodItemCard } from '@/components'
import { colors, ImagesSvg } from '@/utils'
import { useLoading } from '@/hooks/useLoading'

const ListFoodScreen: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const route = useRoute();
  const navigation = useNavigation();
  const { LoadingShow, LoadingHide } = useLoading();

  const foodList = useAppSelector(selectFoodList);
  const searchFoodList = useAppSelector(selectSearchFoodList);
  const isLoadingFood = useAppSelector(selectIsLoadingFood);
  const pagination = useAppSelector(state => state.food.pagination);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    // Nếu có initialSearch param từ HomeScreen, tự động search
    const initialSearch = (route.params as any)?.initialSearch;
    if (initialSearch) {
      setSearchQuery(initialSearch);
      setCurrentPage(1);
      setHasSearched(true);
      setIsSearchMode(true);
      dispatch(searchFoodAPI({ query: initialSearch, page: 1, limit: 10 }));
    } else {
      dispatch(getAllFoodAPI({ page: 1, limit: 10 }));
    }
  }, [dispatch, route.params]);

  // Track loading state
  useEffect(() => {
    if (isLoadingFood && currentPage === 1) {
      LoadingShow();
    } else {
      LoadingHide();
    }
  }, [isLoadingFood, currentPage, LoadingShow, LoadingHide]);

  // Dùng searchFoodList khi search, foodList khi hiển thị danh sách bình thường
  const displayList = isSearchMode ? searchFoodList : foodList;
  const hasNoData = !displayList || displayList.length === 0;

  // Xử lý nhấn button search
  const handleSearchPress = () => {
    console.log('Searching for:', searchQuery);
    setCurrentPage(1);
    setHasSearched(true);
    if (searchQuery.trim() === '') {
      setIsSearchMode(false);
      dispatch(getAllFoodAPI({ page: 1, limit: 10 }));
    } else {
      setIsSearchMode(true);
      dispatch(searchFoodAPI({ query: searchQuery, page: 1, limit: 10 }));
    }
  };

  const loadMoreFood = async () => {
    if (!isLoadingFood && pagination.hasNextPage && currentPage < pagination.totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);

      if (isSearchMode) {
        await dispatch(searchFoodAPI({ query: searchQuery, page: nextPage, limit: 10 })).unwrap();
      } else {
        await dispatch(getAllFoodAPI({ page: nextPage, limit: 10 })).unwrap();
      }
    }
  };

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
          onSubmitEditing={handleSearchPress}
          returnKeyType="search"
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearchPress}
          activeOpacity={0.8}
          disabled={isLoadingFood && hasSearched && isSearchMode}
        >
          {isLoadingFood && isSearchMode ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <IconSvg xml={ImagesSvg.icSearch} width={20} height={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      {isLoadingFood && currentPage === 1 ? null : hasNoData && !isSearchMode ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <NoData
            message={t('no_data')}
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
              console.log('Manually refreshing data');
              setCurrentPage(1);
              dispatch(getAllFoodAPI({ page: 1, limit: 10 }));
            }}>
            <Text style={{ color: 'white' }}>{t('reload')}</Text>
          </TouchableOpacity>
        </View>
      ) : hasSearched && isSearchMode && displayList.length === 0 && !isLoadingFood ? (
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
          data={displayList}
          renderItem={({ item, index }) => (
            <FoodItemCard
              item={item}
              index={index}
              showRating={true}
              onPress={() => {
                (navigation.navigate as any)('FoodDetailScreen', {
                  foodId: item.foodId,
                  userId: item.userId,
                });
              }}
              containerStyle={{ width: '47%' }}
            />
          )}
          keyExtractor={(item, index) => `${item.foodId}_${index}`}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContainer}
          onScroll={({ nativeEvent }) => {
            const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
            const isEndReached = layoutMeasurement.height + contentOffset.y >= contentSize.height - 100;
            if (isEndReached) {
              loadMoreFood();
            }
          }}
          scrollEventThrottle={400}
          ListFooterComponent={
            isLoadingFood && currentPage > 1 ? (
              <View style={{ width: '100%', padding: 16, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            ) : null
          }
        />
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

export default ListFoodScreen;
