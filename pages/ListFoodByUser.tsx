import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import React, {useEffect} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../android/types/StackNavType';
import {SafeAreaView} from 'react-native-safe-area-context';

import {getUserByIdAPI} from '../redux/slices/auth/authThunk.ts';

import {getFoodByIdAPI} from '../redux/slices/food/foodThunk';
import {useAppSelector, useAppDispatch} from '../redux/hooks';
import {RootState} from '../redux/store';
import CustomTitle from '../components/customize/Title.tsx';
import CustomButton from '../components/customize/Button.tsx';
import colors from '../utils/color.ts';
import Header from '../components/customize/Header.tsx';
import CustomAvatar from '../components/customize/Avatar.tsx';
import imgUrl from '../utils/urlImg.ts';

interface ListFoodByUserPageProps
  extends NativeStackScreenProps<RootStackParamList, 'ListFoodByUserPage'> {}

interface InfoItemProps {
  number: number | string;
  label: string;
}

const InfoItem: React.FC<InfoItemProps> = ({number, label}) => (
  <View style={styles.infoItem}>
    <Text>{number}</Text>
    <Text>{label}</Text>
  </View>
);

const ListFoodByUser: React.FC<ListFoodByUserPageProps> = ({
  route,
  navigation,
}) => {
  const {userId} = route.params;
  const dispatch = useAppDispatch();

  const {userFoodList} = useAppSelector((state: RootState) => state.food);
  const {user, isErrorUser, isLoadingUser} = useAppSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    dispatch(getFoodByIdAPI(userId));
    dispatch(getUserByIdAPI(userId));
  }, [dispatch, userId]);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Recipes" iconName="arrowleft" />
      {isLoadingUser ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : isErrorUser ? (
        <Text>Something went wrong</Text>
      ) : (
        <View style={styles.infoContainer}>
          <View style={styles.infoBlock1}>
            {/* Left */}
            <View style={styles.infoBlock2}>
              <CustomAvatar
                width={70}
                height={70}
                borderRadius={35}
                image={user?.avatar || imgUrl.UndefineImg}
              />
              <InfoItem number={userFoodList.length ?? 0} label="Posts" />
              <InfoItem number="0" label="Follower" />
              <InfoItem number="0" label="Following" />
            </View>
            {/* Right */}
            <View style={styles.infoBlock3}>
              <CustomTitle title={user?.username} />
              <Text>{user?.description}</Text>
            </View>
          </View>

          <CustomButton title="Follow" />
        </View>
      )}
      <ScrollView contentContainerStyle={styles.ListFoodContainer}>
        {userFoodList?.map(item => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('RecipeDetailPage', {foodId: item.foodId})
            }
            key={item.foodId}
            style={styles.itemContainer}>
            {/* Top img */}
            <Image style={styles.img} source={{uri: item.foodThumbnail}} />
            {/* Bottom info */}
            <View style={styles.titleItemLeft}>
              <CustomTitle style={styles.title} title={item.foodName} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ListFoodByUser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  infoContainer: {
    paddingVertical: 16,
    backgroundColor: colors.light,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 10,
  },
  infoBlock1: {
    marginBottom: 22,
    gap: 8,
  },
  infoBlock2: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 12,
    gap: 6,
  },
  infoBlock3: {
    paddingHorizontal: 12,
  },
  infoItem: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: 4,
    marginHorizontal: 12,
  },
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  tabVIewContainer: {
    flex: 1,
    backgroundColor: colors.light,
  },
  icon: {
    padding: 12,
  },
  title: {
    padding: 12,
  },
  titleHeader: {
    padding: 12,
    fontSize: 22,
    fontWeight: 'bold',
  },

  inputHeader: {
    width: '90%',
    backgroundColor: colors.light,
    borderRadius: 12,
    padding: 16,
    margin: 18,
  },
  ListFoodContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 14,
    padding: 12,
  },
  itemContainer: {
    width: '47%',
    height: 180,
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
  title2: {
    fontSize: 12,
    color: colors.smallText,
  },
});
