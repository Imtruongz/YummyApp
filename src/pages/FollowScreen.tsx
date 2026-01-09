import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { HomeHeader, CustomAvatar } from '@/components'
import { img, colors, navigate, getStorageString } from '@/utils'
import { useLoading } from '@/hooks/useLoading';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getFollowersAPI, getFollowingAPI, followUserAPI, unfollowUserAPI, isFollowingAPI } from '@/redux/slices/follow/followThunk';
import { selectFollowers, selectFollowing, selectFollowLoading } from '@/redux/selectors';

interface UserItemProps {
  user: {
    userId: string;
    username: string;
    avatar?: string;
    description?: string;
  };
  onPress: (userId: string) => void;
  currentUserId: string;
  onFollowChange?: () => void;
  type?: 'followers' | 'following';
}

const UserItem: React.FC<UserItemProps> = ({ user, onPress, currentUserId, onFollowChange, type }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkFollowStatus();
  }, [currentUserId, user.userId, type]);

  const checkFollowStatus = async () => {
    if (currentUserId && user.userId !== currentUserId) {
      // If we're in the "following" tab, we already know the user is being followed
      if (type === 'following') {
        setIsFollowing(true);
        return;
      }

      // Otherwise, check the follow status via API
      try {
        const result = await dispatch(isFollowingAPI({ followerId: currentUserId, followingId: user.userId }));
        // result.payload is a boolean directly, not an object with isFollow property
        setIsFollowing(result.payload || false);
      } catch (error) {
        console.log('Error checking follow status:', error);
      }
    }
  };

  const handleFollowToggle = async () => {
    setLoading(true);
    try {
      if (isFollowing) {
        await dispatch(unfollowUserAPI({ followerId: currentUserId, followingId: user.userId }));
      } else {
        await dispatch(followUserAPI({ followerId: currentUserId, followingId: user.userId }));
      }

      // Small delay to ensure server has processed the request
      await new Promise(resolve => setTimeout(resolve, 300));

      // Check follow status after action
      const result = await dispatch(isFollowingAPI({ followerId: currentUserId, followingId: user.userId }));
      // result.payload is a boolean directly, not an object with isFollow property
      setIsFollowing(result.payload || false);

      // Refresh the list to show updated data
      onFollowChange?.();
    } catch (error) {
      console.log('Error toggling follow:', error);
    }
    setLoading(false);
  };

  return (
    <View style={styles.userCard}>
      <TouchableOpacity
        style={styles.userCardContent}
        onPress={() => onPress(user.userId)}
      >
        <Image
          source={{ uri: user.avatar || img.defaultAvatar }}
          style={styles.userAvatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{user.username}</Text>
          {user.description ? (
            <Text style={styles.bio} numberOfLines={2}>{user.description}</Text>
          ) : (
            <Text style={styles.bio}>{t('no_bio')}</Text>
          )}
        </View>
      </TouchableOpacity>

      {currentUserId !== user.userId && (
        <TouchableOpacity
          style={[
            styles.followBtn,
            isFollowing && styles.followingBtn
          ]}
          onPress={handleFollowToggle}
          disabled={loading}
        >
          <Text style={[
            styles.followBtnText,
            isFollowing && styles.followingBtnText
          ]}>
            {loading ? '...' : (isFollowing ? t('profile_screen.unfollow_btn') : t('profile_screen.profile_follow_btn'))}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const FollowScreen: React.FC = () => {
  const { t } = useTranslation();
  const route = useRoute<any>();
  const dispatch = useAppDispatch();
  const { LoadingShow, LoadingHide } = useLoading();
  const { userId, type } = route.params as { userId: string; type: 'followers' | 'following' };
  const [currentUserId, setCurrentUserId] = useState('');

  const followers = useAppSelector(selectFollowers(userId));
  const following = useAppSelector(selectFollowing(userId));
  const list = type === 'followers' ? followers : following;
  const loading = useAppSelector(selectFollowLoading(userId));

  useEffect(() => {
    try {
      const id = getStorageString('userId') || '';
      setCurrentUserId(id);
    } catch (e) {
      setCurrentUserId('');
    }
  }, []);

  useEffect(() => {
    if (loading) {
      LoadingShow();
    } else {
      LoadingHide();
    }
  }, [loading, LoadingShow, LoadingHide]);

  useEffect(() => {
    if (type === 'followers') {
      dispatch(getFollowersAPI(userId));
    } else {
      dispatch(getFollowingAPI(userId));
    }
  }, [dispatch, userId, type]);

  const handleUserPress = (selectedUserId: string) => {
    // Navigate within the same navigator (ProfileNavigator) to maintain navigation stack
    navigate('ListFoodByUserPage', { userId: selectedUserId });
  };

  const handleRefresh = () => {
    if (type === 'followers') {
      dispatch(getFollowersAPI(userId));
    } else {
      dispatch(getFollowingAPI(userId));
    }
  };

  return (
    <View style={styles.container}>
      <HomeHeader
        mode="back"
        title={type === 'followers' ? t('profile_screen.profile_followers') : t('profile_screen.profile_following')}
        showGoBack={true}
        showNotification={false}
      />
      <FlatList
        data={list}
        keyExtractor={(item) => item.userId}
        renderItem={({ item }) => (
          <UserItem
            user={item}
            onPress={handleUserPress}
            currentUserId={currentUserId}
            onFollowChange={handleRefresh}
            type={type}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>{t('no_data')}</Text>}
        scrollEventThrottle={16}
      />
    </View>
  );
};

export default FollowScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  listContent: {
    padding: 12,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  userCardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
    backgroundColor: '#ddd',
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primaryText,
    marginBottom: 4,
  },
  bio: {
    fontSize: 13,
    color: colors.smallText,
    lineHeight: 18,
  },
  followBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.primary,
    borderRadius: 8,
    marginLeft: 8,
  },
  followingBtn: {
    backgroundColor: '#f0f0f0',
  },
  followBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.white,
  },
  followingBtnText: {
    color: colors.primary,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.smallText,
    marginTop: 40,
    fontSize: 16,
  },
});
