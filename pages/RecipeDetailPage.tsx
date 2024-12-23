import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../android/types/StackNavType';
import {SafeAreaView} from 'react-native-safe-area-context';
import color from '../utils/color';
import CustomTitle from '../components/customize/Title';
import YoutubePlayer from 'react-native-youtube-iframe';
import LinearGradient from 'react-native-linear-gradient';

interface RecipeDetailPageProps
  extends NativeStackScreenProps<RootStackParamList, 'RecipeDetailPage'> {}

const RecipeDetailPage: React.FC<RecipeDetailPageProps> = ({route}) => {
  const {strMeal, strInstructions, strMealThumb, strYouTube} = route.params;

  const [showstrInstructions, setShowstrInstructions] = useState(false);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <ImageBackground
            style={styles.imgHeader}
            source={{uri: strMealThumb}}>
            <LinearGradient
              colors={['rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.9)']}
              style={styles.linearGradient}>
              <Text style={styles.textTitle}>{strMeal} </Text>
            </LinearGradient>
          </ImageBackground>

          <View style={styles.body}>
            <CustomTitle title="Description" />
            {showstrInstructions ? (
              <Text>{strInstructions}</Text>
            ) : (
              <Text>{strInstructions.substring(0, 200)}...</Text>
            )}
            {!showstrInstructions && (
              <TouchableOpacity onPress={() => setShowstrInstructions(true)}>
                <Text style={styles.readMore}>Read more</Text>
              </TouchableOpacity>
            )}
            <YoutubePlayer
              width={300}
              height={200}
              play={true}
              videoId={strYouTube}
            />
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
    backgroundColor: color.light,
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
    padding: 20,
  },
  readMore: {
    color: '#0056b3',
    marginTop: 10,
  },

  imgBackground: {
    margin: 10,
    resizeMode: 'center',
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
    color: color.light,
  },
});
