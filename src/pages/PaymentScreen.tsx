import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Linking, TextInput, KeyboardAvoidingView, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../android/types/StackNavType';

import api from '@/api/config';
import ConfirmationModal from '@/components/ConfirmationModal';

import { CustomButton, HomeHeader, IconSvg } from '@/components'
import { colors, ImagesSvg, formatUSDCurrency, extractNumbersOnly, BIDVLogo, MBLogo, ZaloPayLogo, showToast } from '@/utils'

type PaymentScreenProps = NativeStackScreenProps<RootStackParamList, 'PaymentScreen'>;
interface PaymentMethod {
  id: string;
  name: string;
  iconType: 'image' | 'custom';
  iconName?: string;
  iconColor?: string;
  imagePath?: any;
  balance?: string;
  selected?: boolean;
  integrated?: boolean;
  cardNumber?: string;
  cardType?: string;
}

interface BankAccount {
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({ navigation, route }) => {
  const { amount: initialAmount = 5, phoneNumber = '0363704403', serviceType = 'Donate', serviceProvider = 'Yummy', userId } = route.params || {};
  const [amount, setAmount] = useState<number>(initialAmount);
  const [inputAmount, setInputAmount] = useState<string>(initialAmount.toString());
  const { t } = useTranslation();

  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState<boolean>(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [recipientBankAccount, setRecipientBankAccount] = useState<BankAccount | null>(null);
  const [loadingBankAccount, setLoadingBankAccount] = useState<boolean>(false);
  const [recipientUsername, setRecipientUsername] = useState<string>('');

  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });
    return () => navigation.getParent()?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  useEffect(() => {
    const fetchRecipientBankAccount = async () => {
      if (userId) {
        setLoadingBankAccount(true);
        try {
          const userResponse = await api.get(`users/getUserById/${userId}`);
          if (userResponse.data && userResponse.data.success) {
            setRecipientUsername(userResponse.data.data.username || '');
          }

          const response = await api.get(`bank-accounts/${userId}`);
          if (response.data && response.data.success && response.data.data) {
            console.log('[PaymentScreen] Fetched recipient bank account:', response.data.data);
            setRecipientBankAccount(response.data.data);
          }
        } catch (error: any) {
          console.log('[PaymentScreen] Error fetching recipient bank account:', error);

          if (error?.response?.status === 404) {
            showToast.warning('Thông báo', t('no_bank_account_message'));
            navigation.goBack();
          } else {
            showToast.error(t('error'), t('failed_to_load_bank_account'));
          }
        } finally {
          setLoadingBankAccount(false);
        }
      }
    };

    fetchRecipientBankAccount();
  }, [userId, t]);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 'zalopay',
      name: 'Ví Zalopay',
      iconType: 'custom',
      selected: false,
      integrated: false
    },
    {
      id: 'mblaos',
      name: 'MBLaos',
      iconType: 'custom',
      selected: true,
      integrated: true
    },
    {
      id: 'bidv',
      name: 'BIDV',
      iconType: 'custom',
      cardType: 'BIDV',
      integrated: false
    }
  ]);

  const formatMoney = (amount: number) => {
    return formatUSDCurrency(amount);
  };

  const handleAmountChange = (text: string) => {
    const numericValue = extractNumbersOnly(text);
    setInputAmount(numericValue);

    if (numericValue) {
      setAmount(parseInt(numericValue, 10));
    } else {
      setAmount(0);
    }
  };

  const handlePaymentMethodSelect = (id: string) => {
    const updatedMethods = paymentMethods.map(method => ({
      ...method,
      selected: method.id === id
    }));
    setPaymentMethods(updatedMethods);
  };

  const handleConfirmPayment = async () => {
    if (!amount || amount <= 0) {
      showToast.error(t('payment_payment_error'), t('payment_enter_valid_amount'));
      return;
    }

    const selectedMethod = paymentMethods.find(method => method.selected);
    if (!selectedMethod) {
      showToast.error(t('payment_payment_error'), t('payment_select_payment_method'));
      return;
    }

    const paymentMethodName = selectedMethod.name;

    setSelectedPaymentMethod(selectedMethod);
    setShowPaymentConfirmation(true);
  };

  const handleProcessPayment = async () => {
    if (!selectedPaymentMethod) return;

    const paymentMethodName = selectedPaymentMethod.name;

    try {
      if (selectedPaymentMethod.integrated) {
        if (selectedPaymentMethod.id === 'bank') {
          if (!recipientBankAccount) {
            showToast.error(t('payment_payment_error'), t('no_recipient_bank_account'));
            return;
          }

          const response = await api.post('/payment/record-bank-transfer', {
            amount: amount,
            description: `Donate $${amount} cho ${recipientUsername} qua YummyApp`,
            receiverId: userId,
            bankAccountInfo: recipientBankAccount
          });

          if (response.data && response.data.success) {
            showToast.success(t('payment_success'), t('payment_bank_transfer_success'));
            navigation.goBack();
          }
        } else {
          const response = await api.post('/payment/create-session', {
            amount: amount,
            description: `Donate $${amount} cho người dùng qua YummyApp`,
            merchantName: 'YummyFood',
            receiverId: userId,
          });

          const data = response.data;

          if (data.success && data.token) {
            const url = `mblaos://pay?token=${data.token}`;
            console.log('Opening URL with dynamic token:', url);
            await Linking.openURL(url);
            return;
          } else {
            throw new Error('Không thể tạo token thanh toán');
          }
        }
      } else {
        showToast.info(t('payment_simulation_notice'), t('payment_method_not_integrated', { method: paymentMethodName }));
      }
    } catch (error) {
      console.log('Lỗi khi thanh toán:', error);
      showToast.error(t('payment_payment_error'), t('payment_general_error'));
    }
  };

  const renderIcon = (method: PaymentMethod) => {
    switch (method.iconType) {
      case 'image':
        return method.imagePath ? <Image source={method.imagePath} style={{ width: 30, height: 30 }} /> : null;
      case 'custom':
        if (method.id === 'zalopay') {
          return <Image source={ZaloPayLogo} style={{ width: 30, height: 30, resizeMode: 'contain' }} />;
        } else if (method.id === 'bidv') {
          return <Image source={BIDVLogo} style={{ width: 30, height: 30, resizeMode: 'contain' }} />;
        } else if (method.id === 'mblaos') {
          return <Image source={MBLogo} style={{ width: 30, height: 30, resizeMode: 'contain' }} />;
        }
        return null;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        style={{ flex: 1 }}
      >
        <HomeHeader
          mode="back"
          title={t('payment_title')}
          showGoBack={true}
          showNotification={false}
        />
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
          {/* Payment Card */}
          <View style={styles.paymentCard}>
            <View style={styles.serviceIconContainer}>
              <IconSvg xml={ImagesSvg.icHeart} width={30} height={30} color={colors.primary} />
            </View>
            <Text style={styles.serviceTitle}>{t('payment_title')}</Text>
            <Text style={styles.phoneNumber}>{recipientBankAccount?.accountName}</Text>
          </View>

          <View style={styles.donationCard}>
            <View style={styles.donationTitleRow}>
              <Text style={styles.donationTitle}>{t('payment_amount')}</Text>
            </View>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencyLabel}>$</Text>
              <TextInput
                style={styles.amountInput}
                value={inputAmount}
                onChangeText={handleAmountChange}
                keyboardType="numeric"
                placeholder={t('payment_enter_amount')}
                placeholderTextColor="#aaa"
              />
            </View>
            <View style={styles.quickAmountContainer}>
              <TouchableOpacity
                style={styles.quickAmountButton}
                onPress={() => { setAmount(5); setInputAmount('5'); }}
              >
                <Text style={styles.quickAmountText}>$5</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickAmountButton}
                onPress={() => { setAmount(10); setInputAmount('10'); }}
              >
                <Text style={styles.quickAmountText}>$10</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickAmountButton}
                onPress={() => { setAmount(20); setInputAmount('20'); }}
              >
                <Text style={styles.quickAmountText}>$20</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Payment Methods Section */}
          <View style={styles.paymentMethodsSection}>
            <View style={styles.paymentMethodsHeader}>
              <Text style={styles.paymentMethodsTitle}>{t('payment_payment_methods')}</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>{t('payment_view_all')}</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.paymentMethodsList}>
              {paymentMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[styles.paymentMethodCard, method.selected && styles.paymentMethodCardSelected]}
                  onPress={() => handlePaymentMethodSelect(method.id)}
                >
                  <View style={styles.paymentMethodContent}>
                    {renderIcon(method)}
                    <Text style={styles.paymentMethodName}>{method.name}</Text>
                    {method.balance && (
                      <Text style={styles.paymentMethodBalance}>{method.balance}</Text>
                    )}
                    {!method.integrated && (
                      <View style={styles.notIntegratedBadge}>
                        <Text style={styles.notIntegratedText}>{t('demo')}</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.bankInfoCard}>
            <Text style={styles.recipientName}>{recipientUsername}</Text>
            <View style={styles.bankInfoRow}>
              <Text style={styles.bankInfoLabel}>{t('bank_name')}:</Text>
              <Text style={styles.bankInfoValue}>{recipientBankAccount?.bankName}</Text>
            </View>
            <View style={styles.bankInfoRow}>
              <Text style={styles.bankInfoLabel}>{t('bank_code')}:</Text>
              <Text style={styles.bankInfoValue}>{recipientBankAccount?.bankCode}</Text>
            </View>
            <View style={styles.bankInfoRow}>
              <Text style={styles.bankInfoLabel}>{t('account_number')}:</Text>
              <Text style={styles.bankInfoValue}>{recipientBankAccount?.accountNumber}</Text>
            </View>
            <View style={styles.bankInfoRow}>
              <Text style={styles.bankInfoLabel}>{t('account_name')}:</Text>
              <Text style={styles.bankInfoValue}>{recipientBankAccount?.accountName}</Text>
            </View>
            <View style={styles.bankInfoRow}>
              <Text style={styles.bankInfoLabel}>{t('transfer_note')}:</Text>
              <View style={styles.transferInputContainer}>
                <TextInput
                  style={styles.transferNoteInput}
                  placeholder={t('enter_transfer_note')}
                  placeholderTextColor="#aaa"
                  defaultValue={`Donate cho ${recipientUsername}`}
                  multiline={false}
                />
                <IconSvg xml={ImagesSvg.icEdit} width={16} height={16} color={colors.primary} />
              </View>
            </View>
          </View>
          <View style={styles.bottomPaymentSection}>
          <View style={styles.totalAmount}>
            <Text style={styles.totalAmountText}>{formatMoney(amount)}</Text>
          </View>
          <CustomButton
            title={t('payment_confirm')}
            onPress={handleConfirmPayment}
            style={styles.confirmButton}
            fontSize={18}
          />
        </View>
        </ScrollView>
        <ConfirmationModal
          visible={showPaymentConfirmation}
          title={t('payment_confirm_donate')}
          message={t('payment_confirm_message', {
            amount: formatMoney(amount),
            method: selectedPaymentMethod?.name || ''
          })}
          onClose={() => setShowPaymentConfirmation(false)}
          onConfirm={handleProcessPayment}
          confirmText={t('payment_confirm')}
          cancelText={t('payment_cancel')}
          type="warning"
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  donationCard: {
    backgroundColor: colors.light,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 4,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  donationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  donationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0d1117',
    marginLeft: 8,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.InputBg,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 52,
  },
  amountInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0d1117',
    padding: 8,
    marginLeft: 2,
  },
  currencyLabel: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.primary,
  },
  quickAmountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAmountButton: {
    backgroundColor: colors.primary + '15',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  quickAmountText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  paymentCard: {
    backgroundColor: colors.light,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 4,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
  },
  serviceIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentMethodsSection: {
    marginTop: 16,
  },
  paymentMethodsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  paymentMethodsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0d1117',
  },
  viewAllText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  paymentMethodsList: {
    paddingLeft: 16,
  },
  paymentMethodCard: {
    width: 160,
    height: 70,
    marginRight: 12,
    backgroundColor: colors.light,
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.InputBg,
  },
  paymentMethodCardSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodName: {
    marginLeft: 8,
    fontSize: 15,
    color: '#0d1117',
    fontWeight: '500',
    maxWidth: 90,
  },
  paymentMethodBalance: {
    position: 'absolute',
    bottom: -15,
    left: 38,
    fontSize: 13,
    color: '#64748b',
  },
  bottomPaymentSection: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  totalAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  totalAmountText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0d1117',
    marginRight: 4,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    height: 48,
    width: '60%',
    paddingHorizontal: 24,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    color: '#333',
  },
  notIntegratedBadge: {
    position: 'absolute',
    bottom: -15,
    right: 0,
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    zIndex: 5,
  },
  notIntegratedText: {
    fontSize: 10,
    color: '#888',
    fontWeight: '500',
  },
  phoneNumber: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  bankInfoCard: {
    backgroundColor: colors.light,
    borderRadius: 8,
    marginVertical: 16,
    marginHorizontal: 16,
    padding: 12,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  recipientName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
  },
  bankInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  bankInfoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },
  bankInfoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    flex: 2,
    textAlign: 'right',
  },
  transferInputContainer: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: colors.InputBg,
  },
  transferNoteInput: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
    padding: 0,
    marginRight: 5,
  },
  editIcon: {
    marginLeft: 4,
    padding: 2,
  },
});

export default PaymentScreen;