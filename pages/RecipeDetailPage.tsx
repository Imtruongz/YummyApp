import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../android/types/StackNavType';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

import colors from '../utils/color';
import CustomTitle from '../components/customize/Title';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomAvatar from '../components/customize/Avatar';
import img from '../utils/urlImg';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {RootState} from '../redux/store';
import {getDetailFoodAPI} from '../redux/slices/food/foodThunk';

import Loading from '../components/skeleton/Loading';

interface RecipeDetailPageProps
  extends NativeStackScreenProps<RootStackParamList, 'RecipeDetailPage'> {}

const RecipeDetailPage: React.FC<RecipeDetailPageProps> = ({
  route,
  navigation,
}) => {
  const {foodId} = route.params;
  const [showstrInstructions, setShowstrInstructions] = useState(false);

  const handleAddFavoriteFood = () => {
    console.log('Add favorite food');
  };

  const dispatch = useAppDispatch();
  const {selectedFood, isLoadingFood, isErrorFood} = useAppSelector(
    (state: RootState) => state.food,
  );

  useEffect(() => {
    if (foodId) {
      dispatch(getDetailFoodAPI(foodId));
    }
  }, [dispatch, foodId]);

  if (isLoadingFood) {
    return <Loading />; // Hiển thị khi dữ liệu đang được tải
  }

  if (isErrorFood || !selectedFood) {
    return <Text>Error loading recipe details.</Text>; // Hiển thị khi có lỗi
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <AntDesignIcon
          name="arrowleft"
          size={24}
          style={styles.arrowLeftIcon}
          color={colors.dark}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <MaterialIcons
          name="favorite-border"
          size={24}
          color={colors.dark}
          style={styles.favoriteIcon}
          onPress={handleAddFavoriteFood}
        />
        <ScrollView>
          <ImageBackground
            style={styles.imgHeader}
            source={{uri: selectedFood.foodThumbnail}}>
            <LinearGradient
              colors={['rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.9)']}
              style={styles.linearGradient}>
              <Text style={styles.textTitle}>{selectedFood.foodName}</Text>
            </LinearGradient>
          </ImageBackground>

          <View style={styles.body}>
            <View style={styles.headerBlock2}>
              <CustomAvatar
                image={selectedFood.userDetail?.avatar || img.UndefineImg}
              />
              <View style={styles.headerBlock3}>
                <CustomTitle title={selectedFood.userDetail?.username} />
                <Text>{selectedFood.userDetail?.email}</Text>
              </View>
            </View>

            <Text>{selectedFood.created_at}</Text>

            <CustomTitle title="Description" />
            {showstrInstructions ? (
              <Text>{selectedFood.foodDescription}</Text>
            ) : (
              <Text>
                {selectedFood.foodDescription
                  ? selectedFood.foodDescription.substring(0, 200)
                  : ''}
                ...
              </Text>
            )}
            {!showstrInstructions && (
              <TouchableOpacity onPress={() => setShowstrInstructions(true)}>
                <Text style={styles.readMore}>Read more</Text>
              </TouchableOpacity>
            )}
            <CustomTitle title="Ingredient" />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default RecipeDetailPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  imgHeader: {
    height: 300,
  },
  img: {
    width: '100%',
    height: '100%',
  },
  body: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 10,
    padding: 18,
  },
  readMore: {
    color: '#0056b3',
  },

  linearGradient: {
    width: '100%',
    height: '100%',
  },

  textTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    position: 'absolute',
    bottom: 10,
    left: 10,
    color: colors.light,
  },

  arrowLeftIcon: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
    backgroundColor: colors.light,
    padding: 10,
    borderRadius: 50,
  },

  favoriteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: colors.light,
    padding: 10,
    borderRadius: 50,
  },
  headerBlock2: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
  },
  headerBlock3: {
    marginHorizontal: 10,
  },
});
