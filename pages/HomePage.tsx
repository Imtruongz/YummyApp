import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../android/types/StackNavType';

import firestore from '@react-native-firebase/firestore';

import CustomButton from '../components/customize/Button';
import CustomModal from '../components/Modal';

interface HomePageProps
  extends NativeStackScreenProps<RootStackParamList, 'HomePage'> {}

const HomePage: React.FC<HomePageProps> = ({}) => {
  const [loading, setLoading] = useState(true);
  const [food, setFood] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const subscriber = firestore()
      .collection('food')
      .onSnapshot(querySnapshot => {
        const food = [];

        querySnapshot.forEach(documentSnapshot => {
          food.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setFood(food);
        setLoading(false);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <SafeAreaView>
      <ScrollView>
        {/* Header(avatar + Notification) */}
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
        {/* Input Search */}
        <View style={styles.searchBlock}>
          <TextInput style={styles.textInputStyle} placeholder="Search" />
        </View>
        {/* Popular food */}
        <View style={styles.popularBlock}>
          <Image
            style={styles.imgBackground}
            source={require('../assets/1.jpg')}
          />
        </View>
        {/* Categories */}
        {/* Flat List */}
        <FlatList
          data={food}
          renderItem={({item}) => (
            <View style={styles.flatListBlockItem}>
              <Text>{item.foodName}</Text>
              <Image width={100} height={50} source={{uri: item.image}} />
            </View>
          )}
        />
        <CustomButton onPress={() => setModalVisible(true)} style={styles.openModalStyle} iconName="plus" />
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <CustomModal />
      </Modal>
    </SafeAreaView>
  );
};

export default HomePage;

const styles = StyleSheet.create({
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
  },
  //FlatList
  flatListBlockItem: {
    width: 100,
    height: 100,
    margin: 10,
    padding: 10,
    borderRadius: 10,
  },
});
