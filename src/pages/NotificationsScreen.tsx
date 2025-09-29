
import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { fetchNotifications } from '../redux/slices/notification/notificationThunk';
import { useRoute } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { setNotifications, setLoading, setError } from '../redux/slices/notification/notificationSlice';

const NotificationsScreen = () => {
  const route = useRoute();
  const userId = (route.params as any)?.userId;
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(state => state.notification.list);
  const loading = useAppSelector(state => state.notification.isLoading);

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
      {!item.isRead && <Text style={styles.unread}>Chưa đọc</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Thông báo</Text>
      {loading ? (
        <Text>Đang tải...</Text>
      ) : notifications.length === 0 ? (
        <Text>Không có thông báo nào.</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item._id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  item: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  title: { fontSize: 16, fontWeight: 'bold' },
  body: { fontSize: 14, color: '#333' },
  time: { fontSize: 12, color: '#888', marginTop: 4 },
  unread: { color: 'red', fontSize: 12, marginTop: 4 },
});

export default NotificationsScreen;
