import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../android/types/StackNavType';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import BannerSlider from '../components/customize/BannerSlider';
import { getLocalBanners, Banner } from '../api/bannerService';


const MaterialIcons = require('react-native-vector-icons/MaterialIcons').default;

import color from '../utils/color';
import imgURL from '../utils/urlImg';
import CustomButton from '../components/customize/CustomButton';
import CustomTitle from '../components/customize/Title';
import Typography from '../components/customize/Typography';
import CustomFoodItem from '../components/customize/FoodItem';
import CustomAvatar from '../components/customize/Avatar';
import Greeting from '../components/customize/Greeting';
import HomeSkeleton from '../components/skeleton/HomeSkeleton';

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
//asyncThunk
import { getAllCategoriesAPI } from '../redux/slices/category/categoryThunk';
import { getAllFoodAPI } from '../redux/slices/food/foodThunk';
import { getAllUsers } from '../redux/slices/auth/authThunk';
import { getUserByIdAPI } from '../redux/slices/auth/authThunk';
import { addFavoriteFoodAPI } from '../redux/slices/favorite/favoriteThunk';

import { MMKV } from 'react-native-mmkv';
import img from '../utils/urlImg';
import Toast from 'react-native-toast-message';
const storage = new MMKV();

import HomeHeader from '../components/HomeHeader';
import { NetworkInfo } from 'react-native-network-info';
import DraggableFloatingButton from '../components/DraggableFloatingButton';
import IconSvg from '../components/IconSvg';
import { ImagesSvg } from '../utils/ImageSvg';

interface HomePageProps
  extends NativeStackScreenProps<RootStackParamList, 'HomePage'> { }

const HomePage: React.FC<HomePageProps> = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const userId = storage.getString('userId') || '';
  const { foodList, isLoadingFood } = useAppSelector(state => state.food);
  const { user, isLoadingUser } = useAppSelector((state: RootState) => state.auth);
  const { ListUser } = useAppSelector((state: RootState) => state.user);
  const { categoryList, isLoadingCategory } = useAppSelector((state: RootState) => state.categories);
  const [isLoading, setIsLoading] = useState(true);
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          dispatch(getAllCategoriesAPI()),
          dispatch(getAllFoodAPI()),
          dispatch(getAllUsers()),
          dispatch(getUserByIdAPI({ userId })),
        ]);
        
        // Lấy dữ liệu banner từ nguồn local (vì chưa có API server)
        const bannerData = getLocalBanners();
        console.log('Loaded local banners:', bannerData.length);
        setBanners(bannerData);
      } catch (error) {
        console.log('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [dispatch, userId]);

  const greetingMessage = () => {
    const currentTime = new Date().getHours();
    if (currentTime < 12) {
      return <Greeting iconName={ImagesSvg.icSun} title={t('goodMorning')} />;
    } else if (currentTime < 18) {
      return <Greeting iconName={ImagesSvg.icSun} title={t('goodAfternoon')} />;
    } else {
      return <Greeting iconName={ImagesSvg.icMoon} title={t('goodEvening')} />;
    }
  };

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
      <ScrollView showsVerticalScrollIndicator={false}>
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
                  navigation.navigate('ListFoodPage');
                }
              }}
            />
          </View>
        )}

        {/* Popular Category Title */}
        <TouchableOpacity style={styles.titleContainer}>
          <CustomTitle title={t('home_popular_categories')} />
        </TouchableOpacity>
        {/* Popular Category List */}
        <FlatList
          data={categoryList}
          horizontal
          showsHorizontalScrollIndicator={true}
          keyExtractor={(item, index) => `${item.categoryId}_${index}`}
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                navigation.navigate('ListFoodByCategoriesPage', {
                  categoryId: item.categoryId,
                })
              }>
              <CustomFoodItem
                title={item.categoryName}
                image={item.categoryThumbnail}
              />
            </Pressable>
          )}
        />
        {/* Daily Food Title */}
        <TouchableOpacity
          onPress={() => navigation.navigate('ListFoodPage')}
          style={styles.titleContainer}>
          <CustomTitle title={t('home_daily_food')} />
          <CustomTitle style={styles.seeAll} title={t('home_see_all')} />
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
              onPress={() =>
                navigation.navigate('RecipeDetailPage', {
                  foodId: item.foodId,
                  userId: item.userId,
                })
              }>
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
                  style={{ color: color.smallText }}
                />
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <CustomAvatar
                    width={30}
                    height={30}
                    borderRadius={15}
                    image={item.userDetail?.avatar || imgURL.defaultAvatar}
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
        {/* Popular Creator Title */}
        <TouchableOpacity style={styles.titleContainer}>
          <CustomTitle title={t('home_popular_creators')} />
        </TouchableOpacity>
        {/* Popular Creator List */}
        <FlatList
          data={ListUser}
          horizontal
          showsHorizontalScrollIndicator={true}
          keyExtractor={(item, index) => `${item.userId}_${index}`}
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                navigation.navigate('ListFoodByUserPage', {
                  userId: item.userId,
                })
              }
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
        onPress={() => navigation.navigate('YummyAIScreen')}
      />
    </SafeAreaView>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.light,
  },
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: color.light,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  bannerContainer: {
    width: '100%',
  },
  header1: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
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
  addFoodBtn: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: color.primary,
  },
  itemContainer: {
    width: 300,
    height: 220,
    margin: 10,
    borderRadius: 20,
    backgroundColor: color.light,
    shadowColor: color.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
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
    color: color.primary,
  },
  aiButtonContainer: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  aiButton: {
    backgroundColor: color.primary,
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  aiButtonText: {
    color: color.white,
  },
});
