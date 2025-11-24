
import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchNotifications } from '../redux/slices/notification/notificationThunk';
import HomeHeader from '../components/HomeHeader';
import { useTranslation } from 'react-i18next';
import { useRoute } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { setNotifications, setLoading, setError } from '../redux/slices/notification/notificationSlice';

const NotificationsScreen = () => {
  const route = useRoute();
  const userId = (route.params as any)?.userId;
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(state => state.notification.list);
  const loading = useAppSelector(state => state.notification.isLoading);
  const { t } = useTranslation();

  useEffect(() => {
    if (userId) {
      dispatch(fetchNotifications(userId));
    }
  }, [userId, dispatch]);

  const handleMarkAsRead = async (notificationId: string) => {
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.item} onPress={() => !item.isRead && handleMarkAsRead(item._id)}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.body}>{item.body}</Text>
      <Text style={styles.time}>{new Date(item.createdAt).toLocaleString()}</Text>
      {!item.isRead && <Text style={styles.unread}>{t('notification_unread')}</Text>}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <HomeHeader mode="title" title={t('notifications')} showNotification={false} />
      <View style={styles.content}>
        {loading ? (
          <Text>{t('loading')}</Text>
        ) : notifications.length === 0 ? (
          <Text>{t('notification_empty')}</Text>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={item => item._id}
            renderItem={renderItem}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, padding: 16 },
  item: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  title: { fontSize: 16, fontWeight: 'bold' },
  body: { fontSize: 14, color: '#333' },
  time: { fontSize: 12, color: '#888', marginTop: 4 },
  unread: { color: 'red', fontSize: 12, marginTop: 4 },
});

export default NotificationsScreen;
