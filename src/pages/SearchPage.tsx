
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, ActivityIndicator, TouchableOpacity, Image, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getAllCategoriesAPI } from '../redux/slices/category/categoryThunk';
import { getFoodByCategoryAPI } from '../redux/slices/food/foodThunk';
// Bỏ SUGGESTIONS cứng, sẽ lấy từ category
import { useTranslation } from 'react-i18next';
import api from '../api/config';

const SearchPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const { categoryList, isLoadingCategory } = useAppSelector(state => state.categories);
  type FoodResult = {
    foodId: string;
    foodName: string;
    foodDescription: string;
    foodThumbnail: string;
  };
  const [allFoods, setAllFoods] = useState<FoodResult[]>([]);
  const [results, setResults] = useState<FoodResult[]>([]);
  const { categoryFoodList, isLoadingFood } = useAppSelector(state => state.food);
  const [isCategorySearch, setIsCategorySearch] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{id: string, name: string} | null>(null);

  useEffect(() => {
    const fetchFoods = async () => {
      setLoading(true);
      try {
        const res = await api.get<FoodResult[]>('/foods/getAll');
        setAllFoods(res.data || []);
        setResults(res.data || []);
      } catch (e) {
        setAllFoods([]);
        setResults([]);
      }
      setLoading(false);
    };
    fetchFoods();
    dispatch(getAllCategoriesAPI());
  }, [dispatch]);

  const handleSearch = (text: string) => {
    setQuery(text);
    setIsCategorySearch(false);
    if (text.trim() === '') {
      setResults(allFoods);
    } else {
      const lower = text.toLowerCase();
      setResults(
        allFoods.filter(f =>
          f.foodName.toLowerCase().includes(lower) ||
          (f.foodDescription && f.foodDescription.toLowerCase().includes(lower))
        )
      );
    }
  };

  // Khi bấm vào category chip
  const handleCategorySearch = (categoryId: string, categoryName: string) => {
    setQuery('');
    setIsCategorySearch(true);
    setSelectedCategory({id: categoryId, name: categoryName});
    dispatch(getFoodByCategoryAPI(categoryId));
  };

  const handleClearCategory = () => {
    setIsCategorySearch(false);
    setSelectedCategory(null);
    setResults(allFoods);
  };


  const renderItem = ({ item }: { item: FoodResult }) => (
    <TouchableOpacity style={styles.item}>
      <Image source={{ uri: item.foodThumbnail }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.foodName}</Text>
        <Text style={styles.desc}>{item.foodDescription}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.header}>{t('tab_search') || 'Tìm kiếm'}</Text>
        <TextInput
          style={styles.input}
          placeholder={t('search') || 'Nhập tên món ăn...'}
          value={query}
          onChangeText={handleSearch}
          clearButtonMode="while-editing"
        />
        {/* Tag category đang chọn */}
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
            <Text style={styles.suggestionTitle}>Gợi ý tìm kiếm theo thể loại</Text>
            {isLoadingCategory ? (
              <ActivityIndicator size="small" color="#888" style={{ marginTop: 8 }} />
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingVertical: 8}}>
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
            <Text style={styles.empty}>{t('list_can_not_find') || 'Không tìm thấy món ăn phù hợp'}</Text>
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
          <Text style={styles.empty}>{t('list_can_not_find') || 'Không tìm thấy món ăn phù hợp'}</Text>
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
    </TouchableWithoutFeedback>
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
    color: '#888',
    fontWeight: 'bold',
    marginTop: -2,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#222',
    alignSelf: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fafafa',
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
    color: '#444',
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
    color: '#333',
    fontSize: 15,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6f6f6',
    borderRadius: 10,
    marginBottom: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
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
    color: '#222',
  },
  desc: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 32,
    fontSize: 16,
  },
});

export default SearchPage;
