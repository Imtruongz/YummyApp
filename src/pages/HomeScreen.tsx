import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View, Image, TouchableOpacity, RefreshControl, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { MMKV } from 'react-native-mmkv';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../android/types/StackNavType';

import { getLocalBanners, Banner } from '@/api/bannerService';
import { HomeHeader, CustomTitle, IconSvg, DraggableFloatingButton, Typography, CategoryItem, CustomAvatar, HomeSkeleton, Greeting, BannerSlider, CustomInput, CustomButton } from '@/components'
import { img, colors, ImagesSvg, handleAsyncAction, navigate, getStorageString } from '@/utils'

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getAllCategoriesAPI } from '@/redux/slices/category/categoryThunk';
import { getAllFoodAPI, getFollowingFoodsAPI } from '@/redux/slices/food/foodThunk';
import { getAllUsers } from '@/redux/slices/auth/authThunk';
import { getUserByIdAPI } from '@/redux/slices/auth/authThunk';
import {
  selectFoodList,
  selectIsLoadingFood,
  selectUser,
  selectIsLoadingUser,
  selectListUser,
  selectCategoryList,
  selectIsLoadingCategory,
  selectFollowingFoodList,
} from '@/redux/selectors';
interface HomeScreenProps
  extends NativeStackScreenProps<RootStackParamList, 'HomeScreen'> { }

const HomeScreen: React.FC<HomeScreenProps> = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const userId = getStorageString('userId') || '';

  const foodList = useAppSelector(selectFoodList);
  const isLoadingFood = useAppSelector(selectIsLoadingFood);
  const followingFoodList = useAppSelector(selectFollowingFoodList);
  const user = useAppSelector(selectUser);
  const isLoadingUser = useAppSelector(selectIsLoadingUser);
  const ListUser = useAppSelector(selectListUser);
  const categoryList = useAppSelector(selectCategoryList);
  const isLoadingCategory = useAppSelector(selectIsLoadingCategory);
  const [isLoading, setIsLoading] = useState(true);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await handleAsyncAction(
        async () => {
          await Promise.all([
            dispatch(getAllCategoriesAPI()),
            dispatch(getAllFoodAPI({ page: 1, limit: 10 })),
            dispatch(getFollowingFoodsAPI({ userId, page: 1, limit: 10 })),
            dispatch(getAllUsers()),
            dispatch(getUserByIdAPI({ userId })),
          ]);

          const bannerData = getLocalBanners();
          console.log('Loaded local banners:', bannerData.length);
          setBanners(bannerData);
        },
        {
          showSuccessToast: false,
          onError: (error) => console.log('Error loading data:', error),
          onSuccess: () => setIsLoading(false)
        }
      );
    };

    loadData();
  }, [dispatch, userId]);

  const greetingMessage = () => {
    const currentTime = new Date().getHours();
    if (currentTime < 12) {
      return <Greeting iconName={ImagesSvg.icSun} title={t('home_screen.goodMorning')} />;
    } else if (currentTime < 18) {
      return <Greeting iconName={ImagesSvg.icSun} title={t('home_screen.goodAfternoon')} />;
    } else {
      return <Greeting iconName={ImagesSvg.icMoon} title={t('home_screen.goodEvening')} />;
    }
  };

  const RenderRefreshControl = () => (
    <RefreshControl refreshing={isLoading} onRefresh={() => { }} />
  );

  if (isLoading || isLoadingFood || isLoadingUser || isLoadingCategory) {
    return <HomeSkeleton />;
  }

  const message = greetingMessage();

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      {/* Header fixed trên cùng */}
      <HomeHeader
        mode="home"
        avatar={user?.avatar}
        username={user?.username}
        greetingMessage={message}
        showNotification={true}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={RenderRefreshControl()}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <CustomInput
            style={styles.searchInput}
            placeholder={t('search_screen.search')}
            onChangeText={text => setSearchQuery(text)}
            value={searchQuery}
            showIcon={true}
            iconXml={ImagesSvg.icSearch}
            iconOnLeft={true}
          />
          {searchQuery.trim() && (
            <CustomButton
              title={t('search_screen.search')}
              onPress={() => {
                navigate('ListFoodScreen', { initialSearch: searchQuery });
                setSearchQuery('');
              }}
              style={styles.searchButton} />
          )}
        </View>
        {/* Banner Slider */}
        {banners.length > 0 && (
          <View style={styles.bannerContainer}>
            <BannerSlider
              data={banners.map(banner => ({
                id: banner.id,
                image: banner.image,
                title: banner.title,
                description: banner.description,
                link: banner.link
              }))}
              dotsPosition="outside"
              onBannerPress={(item) => {
                if (item.link === '/explore') {
                  navigate('ListFoodScreen');
                }
              }}
            />
          </View>
        )}

        {/* Popular Category Title */}
        <TouchableOpacity style={styles.titleContainer}>
          <CustomTitle title={t('home_screen.home_popular_categories')} />
        </TouchableOpacity>
        {/* Popular Category List */}
        <FlatList
          data={categoryList}
          horizontal
          showsHorizontalScrollIndicator={true}
          keyExtractor={(item, index) => `${item.categoryId}_${index}`}
          renderItem={({ item }) => (
            <CategoryItem
              title={item.categoryName}
              image={item.categoryThumbnail}
              onPress={() => navigate('CategoriesScreen', { categoryId: item.categoryId })}
            />
          )}
        />
        {/* Daily Food Title */}
        <TouchableOpacity
          onPress={() => navigate('ListFoodScreen')}
          style={styles.titleContainer}>
          <CustomTitle title={t('home_screen.home_daily_food')} />
          <CustomTitle style={styles.seeAll} title={t('home_screen.home_see_all')} />
        </TouchableOpacity>
        {/* Daily Food List */}
        <FlatList
          data={foodList}
          horizontal
          showsHorizontalScrollIndicator={true}
          initialNumToRender={5}
          keyExtractor={(item, index) => `${item.foodId}_${index}`}
          renderItem={({ item }) => (
            <Pressable
              style={styles.itemContainer}
              onPress={() => navigate('FoodDetailScreen', { foodId: item.foodId, userId: item.userId, })}>
              <Image source={{ uri: item.foodThumbnail }} style={styles.img2} />
              <View style={styles.titleItemLeft2}>
                <Typography
                  title={item.foodName}
                  fontSize={18}
                  fontWeight="700"
                  numberOfLines={2}
                  ellipsizeMode="tail"
                />
                <Typography
                  title={item.foodDescription}
                  fontSize={14}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  style={{ color: colors.smallText }}
                />

                {/* Info Row: Rating, Cooking Time, Difficulty, Servings */}
                <View style={styles.infoRow}>
                  {(item.averageRating !== undefined && item.averageRating !== null) && (
                    <View style={styles.infoBadge}>
                      <Text style={styles.infoBadgeText}>⭐ {(item.averageRating || 0).toFixed(1)}</Text>
                    </View>
                  )}
                  {item.CookingTime && (
                    <View style={styles.infoBadge}>
                      <Text style={styles.infoBadgeText}>⏱️ {item.CookingTime}m</Text>
                    </View>
                  )}
                  {item.difficultyLevel && (
                    <View style={styles.infoBadge}>
                      <Text style={styles.infoBadgeText}>
                        ⚡ {item.difficultyLevel === 'easy' ? 'Dễ' : item.difficultyLevel === 'medium' ? 'Trung bình' : 'Khó'}
                      </Text>
                    </View>
                  )}
                </View>

                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <CustomAvatar
                    width={30}
                    height={30}
                    borderRadius={15}
                    image={item.userDetail?.avatar || img.defaultAvatar}
                  />
                  <Typography
                    title={item.userDetail?.username}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{ flex: 1 }}
                  />
                </View>
              </View>
              <View style={styles.favoriteIcon}>
                <IconSvg xml={ImagesSvg.icHeart} width={16} height={16} color='black' />
              </View>
            </Pressable>
          )}
        />
        {/* Following Feed Title */}
        <TouchableOpacity
          onPress={() => navigate('FollowingFeedScreen')}
          style={styles.titleContainer}>
          <CustomTitle title={t('following_feed') || 'Following Feed'} />
          <CustomTitle style={styles.seeAll} title={t('home_screen.home_see_all')} />
        </TouchableOpacity>
        {/* Following Feed List */}
        {followingFoodList && followingFoodList.length > 0 ? (
          <FlatList
            data={followingFoodList.slice(0, 5)}
            horizontal
            showsHorizontalScrollIndicator={true}
            initialNumToRender={5}
            keyExtractor={(item, index) => `${item.foodId}_${index}`}
            renderItem={({ item }) => (
              <Pressable
                style={styles.itemContainer}
                onPress={() => navigate('FoodDetailScreen', { foodId: item.foodId, userId: item.userId })}>
                <Image source={{ uri: item.foodThumbnail }} style={styles.img2} />
                <View style={styles.titleItemLeft2}>
                  <Typography
                    title={item.foodName}
                    fontSize={18}
                    fontWeight="700"
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  />
                  <Typography
                    title={item.foodDescription}
                    fontSize={14}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={{ color: colors.smallText }}
                  />

                  {/* Info Row: Rating, Cooking Time, Difficulty */}
                  <View style={styles.infoRow}>
                    {(item.averageRating !== undefined && item.averageRating !== null) && (
                      <View style={styles.infoBadge}>
                        <Text style={styles.infoBadgeText}>⭐ {(item.averageRating || 0).toFixed(1)}</Text>
                      </View>
                    )}
                    {item.CookingTime && (
                      <View style={styles.infoBadge}>
                        <Text style={styles.infoBadgeText}>⏱️ {item.CookingTime}m</Text>
                      </View>
                    )}
                    {item.difficultyLevel && (
                      <View style={styles.infoBadge}>
                        <Text style={styles.infoBadgeText}>
                          ⚡ {item.difficultyLevel === 'easy' ? 'Dễ' : item.difficultyLevel === 'medium' ? 'Trung bình' : 'Khó'}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <CustomAvatar
                      width={30}
                      height={30}
                      borderRadius={15}
                      image={item.userDetail?.avatar || img.defaultAvatar}
                    />
                    <Typography
                      title={item.userDetail?.username}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{ flex: 1 }}
                    />
                  </View>
                </View>
                <View style={styles.favoriteIcon}>
                  <IconSvg xml={ImagesSvg.icHeart} width={16} height={16} color='black' />
                </View>
              </Pressable>
            )}
          />
        ) : (
          <View style={styles.emptyFollowingContainer}>
            <Text style={styles.emptyFollowingText}>{t('follow_people_to_see_feed') || 'Follow people to see their posts'}</Text>
          </View>
        )}
        {/* Popular Creator Title */}
        <TouchableOpacity style={styles.titleContainer}>
          <CustomTitle title={t('home_screen.home_popular_creators')} />
        </TouchableOpacity>
        {/* Popular Creator List */}
        <FlatList
          data={ListUser}
          horizontal
          showsHorizontalScrollIndicator={true}
          keyExtractor={(item, index) => `${item.userId}_${index}`}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => navigate('ListFoodByUserPage', { userId: item.userId })}
              style={styles.creatorItems}>
              <CustomAvatar
                width={100}
                height={100}
                borderRadius={50}
                image={item.avatar || img.defaultAvatar}
              />
              <CustomTitle
                title={item.username}
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.creatorName}
              />
            </Pressable>
          )}
        />
        {/* Khoảng trống tránh bị BottomTab che */}
        <View style={{ height: 80 }} />
      </ScrollView>
      <DraggableFloatingButton
        onPress={() => navigate('YummyAIScreen')}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.smallText,
  },
  activeTabText: {
    color: colors.white,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    height: 44,
    backgroundColor: colors.light,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 12,
  },
  searchButton: {
    width: 80,
    height: 44,
    backgroundColor: colors.primary,
  },
  searchButtonText: {
    fontSize: 20,
  },
  bannerContainer: {
    width: '100%',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  favoriteIcon: {
    position: 'absolute',
    bottom: 14,
    right: 14,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  infoBadge: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  infoBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  titleItemLeft2: {
    padding: 14,
    justifyContent: 'flex-start',
    gap: 8,
    flex: 1,
    height: '100%',
    overflow: 'hidden',
  },
  img2: {
    width: 140,
    height: 220,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    resizeMode: 'cover',
  },
  itemContainer: {
    width: 300,
    height: 220,
    margin: 10,
    borderRadius: 20,
    backgroundColor: colors.light,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
    flexDirection: 'row',
  },
  creatorItems: {
    padding: 12,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  creatorName: {
    fontSize: 14,
    maxWidth: 100,
    textAlign: 'center',
  },
  seeAll: {
    fontSize: 14,
    color: colors.primary,
  },
  emptyFollowingContainer: {
    paddingHorizontal: 14,
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyFollowingText: {
    fontSize: 14,
    color: colors.smallText,
    textAlign: 'center',
  },
});
