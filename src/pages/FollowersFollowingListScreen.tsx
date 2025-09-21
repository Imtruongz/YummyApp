import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getFollowersAPI, getFollowingAPI } from '../redux/slices/follow/followThunk';
import colors from '../utils/color.ts';
import imgUrl from '../utils/urlImg.ts';
import Header from '../components/customize/Header.tsx';
import CustomAvatar from '../components/customize/Avatar.tsx';

interface UserItemProps {
  user: {
    userId: string;
    username: string;
    avatar?: string;
    description?: string;
  };
  onPress: (userId: string) => void;
}

const UserItem: React.FC<UserItemProps> = ({ user, onPress }) => (
  <TouchableOpacity style={styles.userItem} onPress={() => onPress(user.userId)}>
    <CustomAvatar
      width={48}
      height={48}
      borderRadius={24}
      image={user.avatar || imgUrl.defaultAvatar}
    />
    <View style={styles.userInfo}>
      <Text style={styles.username}>{user.username}</Text>
      {user.description ? (
        <Text style={styles.bio} numberOfLines={1}>{user.description}</Text>
      ) : null}
    </View>
  </TouchableOpacity>
);

const FollowersFollowingListScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { userId, type } = route.params as { userId: string; type: 'followers' | 'following' };

  const list = useAppSelector((state) => {
    if (type === 'followers') return state.follow.byUserId[userId]?.followers;
    return state.follow.byUserId[userId]?.following;
  }) || [];
  const loading = useAppSelector((state) => state.follow.byUserId[userId]?.loading ?? false);

  useEffect(() => {
    if (type === 'followers') {
      dispatch(getFollowersAPI(userId));
    } else {
      dispatch(getFollowingAPI(userId));
    }
  }, [dispatch, userId, type]);

  const handleUserPress = (selectedUserId: string) => {
    // Điều hướng sang HomeNavigator > ListFoodByUserPage
    // @ts-ignore
    navigation.navigate('HomeNavigator', {
      screen: 'ListFoodByUserPage',
      params: { userId: selectedUserId },
    });
  };

  return (
    <View style={styles.container}>
      <Header title={type === 'followers' ? 'Followers' : 'Following'} iconName="left" />
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={list}
          keyExtractor={(item) => item.userId}
          renderItem={({ item }) => <UserItem user={item} onPress={handleUserPress} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.emptyText}>No users found.</Text>}
        />
      )}
    </View>
  );
};

export default FollowersFollowingListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    padding: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  bio: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
    fontSize: 16,
  },
});
