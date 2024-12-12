import {Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore, {query} from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/firestore';

const ProfilePage = () => {
  const foods = firebase().collection('Food');

  const [food, setFood] = useState([]);

  // useEffect(() => {
  //   console.log(foods);
  //   foods.onSnapshot(querySnapshot => {
  //     const list: any = [];
  //     querySnapshot.forEach(doc => {
  //       list.push({
  //         id: doc.id,
  //         name: doc.data().nameFood,
  //         component: doc.data().components,
  //       });
  //     });
  //     console.log(list);
  //     setFood(list);
  //   });
  // }, [foods]);

  return (
    <View>
      {/* <Text>ProfilePage</Text>
      <View>
        {food.map((item: any) => {
          return <Text key={item.id} >{item.nameFood}</Text>;
        })}
      </View> */}
    </View>
  );
};

export default ProfilePage;
