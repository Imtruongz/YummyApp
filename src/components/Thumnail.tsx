import {ImageBackground, StyleSheet, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import color from '../utils/color';

const Thumnail = () => {
  const [randomFood, setRandomFood] = useState<any>(null);

  const getRandomFood = async () => {
    try {
      const response = await handleGetRandomFood();
      setRandomFood(response.meals[0]);
    } catch (error) {
      console.log('Failed to fetch categories', error);
    }
  };

  useEffect(() => {
    getRandomFood();
  }, []);
  return (
    <>
      <ImageBackground
        style={styles.imgBackground}
        source={{uri: randomFood?.strMealThumb}}>
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.9)']}
          style={styles.linearGradient}>
          <Text style={styles.textTitle}>{randomFood?.strMeal} </Text>
        </LinearGradient>
      </ImageBackground>
    </>
  );
};

export { Thumnail };
export default Thumnail;

const styles = StyleSheet.create({
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
