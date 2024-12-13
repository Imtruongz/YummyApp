import {
  Button,
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../android/types/StackNavType';

interface HomePageProps
  extends NativeStackScreenProps<RootStackParamList, 'HomePage'> {}

const HomePage: React.FC<HomePageProps> = ({navigation}) => {
  interface Item {
    id: string;
    title: string;
    content: string;
  }

  const [itemz, setItem] = useState<Item[]>([
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'First Item',
      content: 'This is the first item',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Second Item',
      content: 'This is the second item',

    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Third Item',
      content: 'This is the third item',

    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d79',
      title: 'Fourth Item',
      content: 'This is the fourth item',
    },
  ]);

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
        <View style={styles.categoriesContainer}>
          <View style={styles.categoriesBlock}>
            <ImageBackground
              style={styles.imgBackground2}
              source={require('../assets/healthyfood.jpg')}
            />
          </View>
          <View style={styles.categoriesBlock}>
            <ImageBackground
              style={styles.imgBackground2}
              source={require('../assets/dailyfood.jpg')}
            />
          </View>
          <View style={styles.categoriesBlock}>
            <ImageBackground
              style={styles.imgBackground2}
              source={require('../assets/gymfood.jpg')}
            />
          </View>
          <View style={styles.categoriesBlock}>
            <ImageBackground
              style={styles.imgBackground2}
              source={require('../assets/healthyfood.jpg')}
            />
          </View>
        </View>
        {/* Flat List */}
        <FlatList
          data={itemz}
          horizontal
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false} // Hide vertical scrollbar
          showsHorizontalScrollIndicator={false} // Hide horizontal scrollbar if any
          renderItem={({item}) => (
            <View style={styles.flatListBlockItem}>
              <Text>{item.title}</Text>
              <Button
                title="Detail"
                onPress={() => navigation.navigate('FoodPage', item)}
              />
            </View>
          )}
        />
      </ScrollView>
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

  imgBackground2: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 25,
  },

  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesBlock: {
    width: '46%',
    height: 104,
    backgroundColor: 'orange',
    borderWidth: 1,
    borderBlockColor: 'black',
    borderRadius: 10,
  },
  flatListBlockItem: {
    width: 100,
    height: 100,
    backgroundColor: 'red',
    margin: 10,
    padding: 10,
    borderRadius: 10,
  },
});
