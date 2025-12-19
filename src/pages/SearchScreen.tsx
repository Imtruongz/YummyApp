
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getAllCategoriesAPI } from '@/redux/slices/category/categoryThunk';
import { getFoodByCategoryAPI } from '@/redux/slices/food/foodThunk';
import {
  selectCategoryList,
  selectIsLoadingCategory,
  selectCategoryFoodList,
  selectIsLoadingFood,
} from '@/redux/selectors';

import api from '@/api/config';
import { HomeHeader, CustomInput, CustomButton } from '@/components'
import { colors, ImagesSvg, tryCatch, navigateToFoodDetail } from '@/utils'

const SearchScreen = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const categoryList = useAppSelector(selectCategoryList);
  const isLoadingCategory = useAppSelector(selectIsLoadingCategory);
  type FoodResult = {
    foodId: string;
    foodName: string;
    foodDescription: string;
    foodThumbnail: string;
  };
  const [results, setResults] = useState<FoodResult[]>([]);
  const categoryFoodList = useAppSelector(selectCategoryFoodList);
  const isLoadingFood = useAppSelector(selectIsLoadingFood);
  const [isCategorySearch, setIsCategorySearch] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{ id: string, name: string } | null>(null);

  useEffect(() => {
    dispatch(getAllCategoriesAPI());
  }, [dispatch]);

  useFocusEffect(
    React.useCallback(() => {
      // Reset state khi focus vào màn hình
      setQuery('');
      setResults([]);
      setIsCategorySearch(false);
      setSelectedCategory(null);
      setLoading(false);
    }, [])
  );

  const handleSearch = (text: string) => {
    setQuery(text);
    setIsCategorySearch(false);
  };

  const handleSearchSubmit = async () => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }
    searchFoods(query);
  };

  const searchFoods = async (searchQuery: string) => {
    setLoading(true);
    const result = await tryCatch(async () => {
      const res = await api.get<{ data: FoodResult[], pagination: any }>('/foods/search', {
        params: { q: searchQuery, page: 1, limit: 20 }
      });
      return res.data.data || [];
    });
    if (result.success && result.data) {
      setResults(result.data);
    } else {
      setResults([]);
    }
    setLoading(false);
  };

  const handleCategorySearch = (categoryId: string, categoryName: string) => {
    setQuery('');
    setIsCategorySearch(true);
    setSelectedCategory({ id: categoryId, name: categoryName });
    dispatch(getFoodByCategoryAPI(categoryId));
  };

  const handleClearCategory = () => {
    setIsCategorySearch(false);
    setSelectedCategory(null);
    setResults([]);
  };


  const renderItem = ({ item }: { item: FoodResult }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigateToFoodDetail(item.foodId, '')}
    >
      <Image source={{ uri: item.foodThumbnail }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.foodName}</Text>
        <Text style={styles.desc}>{item.foodDescription}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <HomeHeader
        mode="search"
        title={t('search')}
        showNotification={false}
      />
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
        <CustomInput
          style={styles.inputHeader}
          placeholder={t('search_screen.search')}
          value={query}
          onChangeText={handleSearch}
          showIcon={true}
          iconXml={ImagesSvg.icSearch}
          isDisabled={true}
          iconOnLeft={true}
        />
        {query.trim() && (
          <CustomButton
            title={t('search_screen.search')}
            style={styles.searchButton}
            onPress={handleSearchSubmit}
          />
        )}
        </View>
        {isCategorySearch && selectedCategory && (
          <View style={styles.selectedCategoryTagContainer}>
            <View style={styles.selectedCategoryTag}>
              <Text style={styles.selectedCategoryText}>{selectedCategory.name}</Text>
              <TouchableOpacity onPress={handleClearCategory} style={styles.clearTagBtn}>
                <Text style={styles.clearTagText}>×</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {query.trim() === '' && !isCategorySearch ? (
          <View style={styles.suggestionContainer}>
            <Text style={styles.suggestionTitle}>{t('search_screen.search_suggestion_title')}</Text>
            {isLoadingCategory ? (
              <View style={{ width: '100%', alignItems: 'center' }}>
                <ActivityIndicator size="small" color="#888" style={{ marginTop: 8 }} />
              </View>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 8 }}>
                {categoryList.map(cat => (
                  <TouchableOpacity
                    key={cat.categoryId}
                    style={styles.suggestionChip}
                    onPress={() => handleCategorySearch(cat.categoryId, cat.categoryName)}
                  >
                    <Text style={styles.suggestionText}>{cat.categoryName}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        ) : isCategorySearch ? (
          isLoadingFood ? (
            <ActivityIndicator size="large" color="#888" style={{ marginTop: 24 }} />
          ) : categoryFoodList.length === 0 ? (
            <Text style={styles.empty}>{t('search_screen.list_can_not_find') || 'Không tìm thấy món ăn phù hợp'}</Text>
          ) : (
            <FlatList
              data={categoryFoodList}
              keyExtractor={item => item.foodId}
              renderItem={renderItem}
              style={{ width: '100%' }}
              contentContainerStyle={{ paddingBottom: 24 }}
            />
          )
        ) : loading ? (
          <ActivityIndicator size="large" color="#888" style={{ marginTop: 24 }} />
        ) : results.length === 0 ? (
          <Text style={styles.empty}>{t('search_screen.list_can_not_find') || 'Không tìm thấy món ăn phù hợp'}</Text>
        ) : (
          <FlatList
            data={results}
            keyExtractor={item => item.foodId}
            renderItem={renderItem}
            style={{ width: '100%' }}
            contentContainerStyle={{ paddingBottom: 24 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  selectedCategoryTagContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    marginTop: 4,
  },
  selectedCategoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  selectedCategoryText: {
    color: '#333',
    fontSize: 15,
    marginRight: 6,
  },
  clearTagBtn: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  clearTagText: {
    fontSize: 18,
    color: colors.dark,
    fontWeight: 'bold',
    marginTop: -2,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  searchContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fafafa',
  },
  searchButton: {
    width: 80,
    height: 44,
    backgroundColor: colors.primary,
  },
  searchButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  suggestionContainer: {
    marginTop: 24,
    alignItems: 'flex-start',
    width: '100%',
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.primaryText,
    marginLeft: 4,
  },
  suggestionChip: {
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  suggestionText: {
    color: colors.primaryText,
    fontSize: 15,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6f6f6',
    borderRadius: 10,
    marginBottom: 12,
    padding: 10,
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primaryText,
  },
  desc: {
    fontSize: 13,
    color: colors.smallText,
    marginTop: 2,
  },
  empty: {
    textAlign: 'center',
    color: colors.dark,
    marginTop: 32,
    fontSize: 16,
  },
  inputHeader: {
    flex: 1,
    height: 52,
    paddingHorizontal: 12,
    backgroundColor: colors.light,
  },
});

export default SearchScreen;
