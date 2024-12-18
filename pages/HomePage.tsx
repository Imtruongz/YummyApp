import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../android/types/StackNavType';

// Firebase
import firestore from '@react-native-firebase/firestore';


// Custom
import CustomButton from '../components/customize/Button';
import CustomModal from '../components/Modal';
import CustomTitle from '../components/customize/Title';
import CustomFoodItem from '../components/customize/FoodItem';

// Reudx
import {useAppSelector} from '../redux/hooks';
import {RootState} from '../redux/store';

interface HomePageProps
  extends NativeStackScreenProps<RootStackParamList, 'HomePage'> {}

const HomePage: React.FC<HomePageProps> = ({}) => {
  const [loading, setLoading] = useState(true);
  const [food, setFood] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const foodList = useAppSelector((state: RootState) => state.food.foods);

  //console.log('foodList', foodList);

  useEffect(() => {
    const subscriber = firestore()
      .collection('food')
      .onSnapshot(querySnapshot => {
        const ListFood = [];

        querySnapshot.forEach(documentSnapshot => {
          ListFood.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setFood(food);
        setLoading(false);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  });

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.headerBlock}>
          <Image
            style={styles.imgStyle}
            source={require('../assets/Logo.webp')}
          />
          <Image
            style={styles.imgAvatar}
            source={require('../assets/avt.png')}
          />
        </View>
        <View style={styles.searchBlock}>
          <TextInput style={styles.textInputStyle} placeholder="Search" />
        </View>
        {/* Header */}

        {/* Thumnail */}
        <View style={styles.popularBlock}>
          <Image
            style={styles.imgBackground}
            source={require('../assets/1.jpg')}
          />
        </View>
        {/* Thumnail */}

        {/* Popular food */}
        <CustomTitle title="Popular food" />
        <FlatList
          data={food}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <CustomFoodItem title={item.foodName} image={item.image} />
          )}
        />

        {/* New food update by user */}
        <CustomTitle title="New food update" />
        <FlatList
          data={foodList}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <CustomFoodItem title={item.name} image={item.image} />
          )}
        />
      </ScrollView>

      {/* Button add new Food */}
      <CustomButton
        title="+"
        onPress={() => setModalVisible(true)}
        style={styles.openModalStyle}
      />

      {/* Modal add new Food */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <CustomModal onPress={() => setModalVisible(false)} />
      </Modal>
    </SafeAreaView>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  // Header css
  headerBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  imgStyle: {
    width: 100,
    height: 40,
    resizeMode: 'contain',
  },
  imgAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderBlockColor: 'orange',
  },
  openModalStyle: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'orange',
  },

  //Search food
  searchBlock: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputStyle: {
    width: '92%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 25,
  },
  //Popular food
  popularBlock: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },

  imgBackground: {
    padding: 26,
    width: '90%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
  },
});
