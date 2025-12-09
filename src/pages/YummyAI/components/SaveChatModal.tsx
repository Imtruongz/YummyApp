import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors } from '@/utils';
interface SaveChatModalProps {
  visible: boolean;
  isLoading: boolean;
  onSave: (title: string) => Promise<void>;
  onCancel: () => void;
}

const SaveChatModal: React.FC<SaveChatModalProps> = ({
  visible,
  isLoading,
  onSave,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');

  const handleSave = async () => {
    if (title.trim() === '') {
      // Auto-generate title from first message
      await onSave('');
    } else {
      await onSave(title.trim());
    }
    setTitle('');
  };

  const handleCancel = () => {
    setTitle('');
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>
            {t('chatHistory.saveChatTitle')}
          </Text>

          <TextInput
            style={styles.input}
            placeholder={t('chatHistory.enterChatTitle')}
            value={title}
            onChangeText={setTitle}
            editable={!isLoading}
            maxLength={255}
          />

          <Text style={styles.characterCount}>
            {title.length}/255
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>
                {t('cancel')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.saveButtonText}>
                  {t('save')}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    backgroundColor: colors.light,
    borderRadius: 12,
    padding: 20,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 8,
    color: '#333',
  },
  characterCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#999',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#FF6B6B',
  },
  saveButtonText: {
    color: colors.light,
    fontWeight: '600',
  },
});

export { SaveChatModal };
export default SaveChatModal;
