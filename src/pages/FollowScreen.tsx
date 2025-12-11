import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { HomeHeader, CustomAvatar } from '@/components'
import {img, colors, navigate} from '@/utils'

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getFollowersAPI, getFollowingAPI } from '@/redux/slices/follow/followThunk';
import { selectFollowers, selectFollowing, selectFollowLoading } from '@/redux/selectors';

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
      image={user.avatar || img.defaultAvatar}
    />
    <View style={styles.userInfo}>
      <Text style={styles.username}>{user.username}</Text>
      {user.description ? (
        <Text style={styles.bio} numberOfLines={1}>{user.description}</Text>
      ) : null}
    </View>
  </TouchableOpacity>
);

const FollowScreen: React.FC = () => {
  const { t } = useTranslation();
  const route = useRoute<any>();
  const dispatch = useAppDispatch();
  const { userId, type } = route.params as { userId: string; type: 'followers' | 'following' };

  const followers = useAppSelector(selectFollowers(userId));
  const following = useAppSelector(selectFollowing(userId));
  const list = type === 'followers' ? followers : following;
  const loading = useAppSelector(selectFollowLoading(userId));

  useEffect(() => {
    if (type === 'followers') {
      dispatch(getFollowersAPI(userId));
    } else {
      dispatch(getFollowingAPI(userId));
    }
  }, [dispatch, userId, type]);

  const handleUserPress = (selectedUserId: string) => {
    // Điều hướng sang HomeNavigator > ListFoodByUserPage
    navigate('HomeNavigator', {
      screen: 'ListFoodByUserPage',
      params: { userId: selectedUserId },
    });
  };

  return (
    <View style={styles.container}>
      <HomeHeader 
        mode="back" 
        title={type === 'followers' ? t('profile_followers') || 'Followers' : t('profile_following') || 'Following'} 
        showGoBack={true}
        showNotification={false}
        isBackHome={true}
      />
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={list}
          keyExtractor={(item) => item.userId}
          renderItem={({ item }) => <UserItem user={item} onPress={handleUserPress} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.emptyText}>{t('follow_no_users') || 'No users found.'}</Text>}
        />
      )}
    </View>
  );
};

export default FollowScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
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
