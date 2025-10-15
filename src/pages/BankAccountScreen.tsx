import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import { useNotification } from '../contexts/NotificationContext';
import ConfirmationModal from '../components/common/ConfirmationModal';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../android/types/StackNavType';
import HomeHeader from '../components/HomeHeader';
import colors from '../utils/color';
import api from '../api/config';
const IoniconsIcon = require('react-native-vector-icons/Ionicons').default;
const AntDesignIcon = require('react-native-vector-icons/AntDesign').default;

type BankAccountScreenProps = NativeStackScreenProps<RootStackParamList, 'BankAccountScreen'>;

interface BankInfo {
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
}

const BankAccountScreen: React.FC<BankAccountScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { showNotification } = useNotification();
  const [bankAccount, setBankAccount] = useState<BankInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isBankModalVisible, setIsBankModalVisible] = useState<boolean>(false);
  const [isConfirmDeleteVisible, setIsConfirmDeleteVisible] = useState<boolean>(false);
  
  // Form state
  const [bankName, setBankName] = useState<string>('');
  const [bankCode, setBankCode] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [accountName, setAccountName] = useState<string>('');
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  // Predefined bank list (có thể mở rộng thêm)
  const bankList = [
    { name: 'Military Commercial Joint Stock Bank - Laos branch', code: 'MB' },
    { name: 'BIDV - Bank for Investment and Development of Vietnam', code: 'BIDV' },
    { name: 'Vietcombank - Joint Stock Commercial Bank for Foreign Trade of Vietnam', code: 'VCB' }
  ];
  
  useEffect(() => {
    // Fetch user's bank account
    fetchBankAccount();
  }, []);
  
  useEffect(() => {
    // Validate form
    if (bankName.trim() && bankCode.trim() && 
        accountNumber.trim() && accountName.trim()) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [bankName, bankCode, accountNumber, accountName]);
  
  const fetchBankAccount = async () => {
    setIsLoading(true);
    try {
      // Gọi API để lấy thông tin tài khoản ngân hàng của người dùng
      const response = await api.get('/bank-accounts');
      
      if (response.data.success && response.data.data) {
        setBankAccount(response.data.data);
        
        // Nếu đang trong chế độ chỉnh sửa, cập nhật form
        if (isEditing) {
          setBankName(response.data.data.bankName);
          setBankCode(response.data.data.bankCode);
          setAccountNumber(response.data.data.accountNumber);
          setAccountName(response.data.data.accountName);
        }
      } else {
        setBankAccount(null);
      }
      setIsLoading(false);
    } catch (error) {
      console.log('Error fetching bank account:', error);
      showNotification({
        type: 'error',
        title: t('error'),
        message: t('failed_to_load_bank_accounts'),
        duration: 3000,
      });
      setIsLoading(false);
    }
  };
  
  const handleSaveAccount = async () => {
    if (!isFormValid) return;
    
    const accountData: BankInfo = {
      bankName: bankName,
      bankCode: bankCode,
      accountNumber: accountNumber,
      accountName: accountName
    };
    
    try {
      // Gọi API để lưu thông tin tài khoản
      const response = await api.post('/bank-accounts', accountData);
      
      if (response.data.success) {
        setBankAccount(response.data.data);
        setIsEditing(false);
        
        showNotification({
          type: 'success',
          title: t('success'),
          message: t('bank_account_added_successfully'),
          duration: 3000,
        });
      }
    } catch (error) {
      console.log('Error saving bank account:', error);
      showNotification({
        type: 'error',
        title: t('error'),
        message: t('failed_to_add_bank_account'),
        duration: 3000,
      });
    }
  };
  
  const handleStartEdit = () => {
    if (bankAccount) {
      setBankName(bankAccount.bankName);
      setBankCode(bankAccount.bankCode);
      setAccountNumber(bankAccount.accountNumber);
      setAccountName(bankAccount.accountName);
    }
    setIsEditing(true);
  };
  
  const handleDeleteAccount = () => {
    setIsConfirmDeleteVisible(true);
  };
  
  const confirmDeleteAccount = async () => {
    try {
      // Gọi API để xóa tài khoản
      const response = await api.delete('/bank-accounts');
      
      if (response.data.success) {
        setBankAccount(null);
        
        showNotification({
          type: 'success',
          title: t('success'),
          message: t('bank_account_deleted_successfully'),
          duration: 3000,
        });
      }
    } catch (error) {
      console.log('Error deleting bank account:', error);
      showNotification({
        type: 'error',
        title: t('error'),
        message: t('failed_to_delete_bank_account'),
        duration: 3000,
      });
    } finally {
      setIsConfirmDeleteVisible(false);
    }
  };
  
  const resetForm = () => {
    setBankName('');
    setBankCode('');
    setAccountNumber('');
    setAccountName('');
    setIsEditing(false);
  };
  
  const renderBankAccount = () => {
    if (!bankAccount) return null;
    
    return (
      <View style={styles.bankAccountItem}>
        <View style={styles.bankAccountDetails}>
          <View style={styles.bankNameRow}>
            <Text style={styles.bankName}>{bankAccount.bankName}</Text>
          </View>
          <Text style={styles.accountNumber}>{bankAccount.accountNumber}</Text>
          <Text style={styles.accountName}>{bankAccount.accountName}</Text>
        </View>
        
        <View style={styles.bankAccountActions}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleStartEdit}
          >
            <Text style={styles.actionButtonText}>{t('edit')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]} 
            onPress={handleDeleteAccount}
          >
            <IoniconsIcon name="trash-outline" size={18} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  const renderAccountForm = () => {
    return (
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>
          {bankAccount ? t('edit_bank_account') : t('add_new_bank_account')}
        </Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>{t('bank_name')}</Text>
          <TouchableOpacity 
            style={styles.selectBankButton}
            onPress={() => setIsBankModalVisible(true)}
          >
            <TextInput
              style={[styles.input, { color: bankName ? colors.dark : colors.gray }]}
              value={bankName}
              placeholder={t('select_or_enter_bank_name')}
              editable={false}
              pointerEvents="none"
            />
            <IoniconsIcon 
              name="chevron-down" 
              size={20} 
              color={colors.primary}
              style={styles.selectIcon} 
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>{t('bank_code')}</Text>
          <TextInput
            style={[styles.input, { color: bankCode ? colors.dark : colors.gray, backgroundColor: '#F5F7FA' }]}
            value={bankCode}
            placeholder="MB, BIDV, VCB..."
            editable={false}
            pointerEvents="none"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>{t('account_number')}</Text>
          <TextInput
            style={styles.input}
            value={accountNumber}
            onChangeText={setAccountNumber}
            placeholder="1000004xxxxx"
            keyboardType="numeric"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>{t('account_name')}</Text>
          <TextInput
            style={styles.input}
            value={accountName}
            onChangeText={setAccountName}
            placeholder={t('account_name_placeholder')}
            autoCapitalize="characters"
          />
        </View>
        
        <View style={styles.formActions}>
          <TouchableOpacity
            style={[styles.formButton, styles.cancelButton]}
            onPress={resetForm}
          >
            <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.formButton, 
              styles.saveButton,
              !isFormValid && styles.disabledButton
            ]}
            onPress={handleSaveAccount}
            disabled={!isFormValid}
          >
            <Text style={[
              styles.saveButtonText,
              !isFormValid && styles.disabledButtonText
            ]}>
              {t('save')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  // Render bank selection modal
  const renderBankSelectionModal = () => {
    return (
      <Modal
        visible={isBankModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsBankModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('select_bank')}</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setIsBankModalVisible(false)}
              >
                <IoniconsIcon name="close" size={24} color={colors.dark} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={bankList}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.bankOption}
                  onPress={() => {
                    setBankName(item.name);
                    setBankCode(item.code);
                    setIsBankModalVisible(false);
                  }}
                >
                  <Text style={styles.bankOptionName}>{item.name}</Text>
                  <Text style={styles.bankOptionCode}>{item.code}</Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
            
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setIsBankModalVisible(false)}
            >
              <Text style={styles.modalCancelButtonText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <HomeHeader
        mode="back"
        title={t('bank_accounts')}
        showGoBack={true}
        showNotification={false}
      />
      
      <ScrollView style={styles.content}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <>
            {!bankAccount && !isEditing ? (
              <View style={styles.emptyContainer}>
                <IoniconsIcon name="wallet-outline" size={60} color={colors.gray} />
                <Text style={styles.emptyText}>{t('no_bank_account')}</Text>
                <Text style={styles.emptySubText}>{t('add_bank_account_to_receive')}</Text>
              </View>
            ) : (
              !isEditing && (
                <View style={styles.bankAccountsContainer}>
                  {renderBankAccount()}
                </View>
              )
            )}
            
            {isEditing ? (
              renderAccountForm()
            ) : (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  if (bankAccount) {
                    // Nếu có tài khoản ngân hàng, điền thông tin vào form
                    handleStartEdit();
                  } else {
                    // Nếu không có tài khoản, hiển thị form trống
                    resetForm();
                    setIsEditing(true);
                  }
                }}
              >
                <AntDesignIcon name="plus" size={20} color={colors.light} />
                <Text style={styles.addButtonText}>
                  {bankAccount ? t('edit_bank_account') : t('add_bank_account')}
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </ScrollView>
      
      {/* Render bank selection modal */}
      {renderBankSelectionModal()}
      
      {/* Confirmation Modal for delete */}
      <ConfirmationModal
        visible={isConfirmDeleteVisible}
        title={t('confirm_delete')}
        message={t('confirm_delete_bank_account')}
        type="warning"
        onClose={() => setIsConfirmDeleteVisible(false)}
        onConfirm={confirmDeleteAccount}
        confirmText={t('delete')}
        cancelText={t('cancel')}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: colors.gray,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  bankAccountsContainer: {
    marginBottom: 20,
  },
  bankAccountItem: {
    backgroundColor: colors.light,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bankAccountDetails: {
    marginBottom: 12,
  },
  bankNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bankName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    flex: 1,
  },
  defaultBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  defaultText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  accountNumber: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 4,
  },
  accountName: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.dark,
  },
  bankAccountActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  actionButtonText: {
    color: colors.primary,
    fontWeight: '500',
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: '#FFEBE9',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  addButtonText: {
    color: colors.light,
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  formContainer: {
    backgroundColor: colors.light,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.dark,
    marginBottom: 8,
  },
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    height: 46,
    backgroundColor: '#F5F7FA',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingRight: 40, // Thêm padding bên phải để tránh text bị đè lên icon
    fontSize: 15,
    color: colors.dark,
    flex: 1,
  },
  dropdownButton: {
    position: 'absolute',
    right: 10,
    padding: 5,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  formButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F7FA',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 12,
  },
  cancelButtonText: {
    color: colors.gray,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  saveButtonText: {
    color: colors.light,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#E2E8F0',
  },
  disabledButtonText: {
    color: '#94A3B8',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end', // Modal hiển thị từ dưới lên
  },
  modalContainer: {
    backgroundColor: colors.light,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
  },
  closeButton: {
    padding: 5,
  },
  bankOption: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  bankOptionName: {
    fontSize: 16,
    color: colors.dark,
  },
  bankOptionCode: {
    fontSize: 14,
    color: colors.smallText,
    marginTop: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  modalCancelButton: {
    marginTop: 10,
    marginHorizontal: 16,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
  },
  modalCancelButtonText: {
    fontSize: 16,
    color: colors.dark,
    fontWeight: '500',
  },
  selectBankButton: {
    width: '100%',
    position: 'relative',
  },
  selectIcon: {
    position: 'absolute',
    right: 10,
    top: 13,
  },
});

export default BankAccountScreen;