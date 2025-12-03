import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import IconSvg from '../../../components/IconSvg';
import { ImagesSvg } from '../../../utils/ImageSvg';
import ConfirmationModal from '../../../components/common/ConfirmationModal';
import { ActivityIndicator } from 'react-native-paper';

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
        return t('chatHistory.yesterday');
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
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setShowDeleteModal(false);
    await onDelete();
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
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <ActivityIndicator size="small"/>
        ) : (
          <IconSvg xml={ImagesSvg.icTrash} width={18} height={18} color="#FF6B6B" />
        )}
      </TouchableOpacity>

      <ConfirmationModal
        visible={showDeleteModal}
        title={t('chatHistory.deleteConfirm')}
        message={t('chatHistory.deleteMessage') }
        type="warning"
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        confirmText={t('delete')}
        cancelText={t('cancel')}
      />
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
