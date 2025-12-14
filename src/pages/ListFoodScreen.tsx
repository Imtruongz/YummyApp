import React, {useEffect, useState} from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator} from 'react-native';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';

import {useAppDispatch, useAppSelector} from '@/redux/hooks';
import {getAllFoodAPI, searchFoodAPI} from '@/redux/slices/food/foodThunk';
import { selectFoodList, selectIsLoadingFood } from '@/redux/selectors';

import { HomeHeader, CustomTitle, IconSvg, NoData, Loading, CustomInput } from '@/components'
import { colors, ImagesSvg, navigate} from '@/utils'

const ListFoodScreen: React.FC = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();

  const foodList = useAppSelector(selectFoodList);
  const isLoadingFood = useAppSelector(selectIsLoadingFood);
  const pagination = useAppSelector(state => state.food.pagination);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  useEffect(() => {
    dispatch(getAllFoodAPI({ page: 1, limit: 10 }));
  }, [dispatch]);

  if (isLoadingFood && currentPage === 1 && !isSearchMode) {
    return <Loading />;
  }

  const hasNoData = !foodList || foodList.length === 0;

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
    <SafeAreaView style={styles.container}  edges={['left', 'right']}>
      <HomeHeader 
        mode="back" 
        title={t('add_category')} 
        showGoBack={true}
        showNotification={false}
        isBackHome={true}
      />
      <View style={styles.searchContainer}>
        <CustomInput
          style={[styles.inputHeader, {flex: 1}]}
          placeholder={t('search')}
          onChangeText={text => setSearchQuery(text)}
          value={searchQuery}
          showIcon={true}
          iconXml={ImagesSvg.icSearch}
          iconOnLeft={true}
        />
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={handleSearchPress}
          disabled={isLoadingFood && hasSearched && isSearchMode}
        >
          <Text style={styles.searchButtonText}>{t('search')}</Text>
        </TouchableOpacity>
      </View>
      
      {isLoadingFood && hasSearched && isSearchMode && currentPage === 1 ? (
        <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center'}}>
          <ActivityIndicator size="large" color='red' />
        </View>
      ) : hasNoData && !isSearchMode ? (
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
              console.log('Manually refreshing data');
              setCurrentPage(1);
              dispatch(getAllFoodAPI({ page: 1, limit: 10 }));
            }}>
            <Text style={{color: 'white'}}>{t('reload')}</Text>
          </TouchableOpacity>
        </View>
      ) : hasSearched && isSearchMode && foodList.length === 0 && !isLoadingFood ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <NoData 
            message={t('list_nodata')}
            width={120}
            height={120}
            textSize={16}
          />
        </View>
      ) : (
        <ScrollView 
          contentContainerStyle={styles.container2}
          onScroll={({ nativeEvent }) => {
            const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
            const isEndReached = layoutMeasurement.height + contentOffset.y >= contentSize.height - 100;
            if (isEndReached) {
              loadMoreFood();
            }
          }}
          scrollEventThrottle={400}
        >
          {foodList?.map(item => (
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
                  <IconSvg xml={ImagesSvg.icStar} width={18} height={18} color={colors.primary} />
                  <Text style={{color: colors.smallText, fontWeight: 'bold'}}>
                    ({(item.averageRating || 0).toFixed(1)})
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          
          {/* Loading indicator khi load thêm */}
          {isLoadingFood && currentPage > 1 && (
            <View style={{ width: '100%', padding: 16, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )}
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

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 10,
  },

  inputHeader: {
    height: 52,
    paddingHorizontal: 12,
    margin: 12,
    backgroundColor: colors.light,
  },

  searchButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 52,
    marginRight: 12,
  },

  searchButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
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

export default ListFoodScreen;
