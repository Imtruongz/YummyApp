import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';

const Ionicons = require('react-native-vector-icons/Ionicons').default;

interface ChatHistoryItemProps {
  conversationId: string;
  title: string;
  createdAt: string;
  onPress: () => void;
  onDelete: () => Promise<void>;
  isDeleting?: boolean;
}

const ChatHistoryItem: React.FC<ChatHistoryItemProps> = ({
  conversationId,
  title,
  createdAt,
  onPress,
  onDelete,
  isDeleting = false,
}) => {
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const yesterdayOnly = new Date(
        yesterday.getFullYear(),
        yesterday.getMonth(),
        yesterday.getDate()
      );

      if (dateOnly.getTime() === todayOnly.getTime()) {
        return date.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
      } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
        return t('chatHistory.yesterday') || 'Yesterday';
      } else {
        return date.toLocaleDateString([], {
          month: 'short',
          day: 'numeric',
        });
      }
    } catch (error) {
      return new Date(dateString).toLocaleDateString();
    }
  };

  const handleDelete = () => {
    Alert.alert(
      t('chatHistory.deleteConfirm') || 'Delete Conversation',
      t('chatHistory.deleteMessage') ||
        'Are you sure you want to delete this conversation? This action cannot be undone.',
      [
        {
          text: t('common.cancel') || 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: t('common.delete') || 'Delete',
          onPress: onDelete,
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.content}
        onPress={onPress}
        disabled={isDeleting}
      >
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.date}>{formatDate(createdAt)}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <Ionicons name="hourglass" size={18} color="#FF6B6B" />
        ) : (
          <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
    color: '#999',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
});

export default ChatHistoryItem;
