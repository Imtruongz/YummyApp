import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Linking, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';

import ConfirmationModal from '@/components/ConfirmationModal';
import { PaymentScreenProps, PaymentMethod, BankAccount, INITIAL_PAYMENT_METHODS } from './type';
import * as paymentService from './paymentService';
import { CustomButton, HomeHeader, IconSvg } from '@/components'
import { colors, ImagesSvg, formatUSDCurrency, extractNumbersOnly, BIDVLogo, MBLogo, ZaloPayLogo, showToast, goBack, navigate } from '@/utils'

const PaymentScreen: React.FC<PaymentScreenProps> = ({ route }) => {
  const { t } = useTranslation();
  const { amount: initialAmount = 5, userId } = route.params || {};

  const [amount, setAmount] = useState<number>(initialAmount);
  const [inputAmount, setInputAmount] = useState<string>(initialAmount.toString());
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState<boolean>(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [recipientBankAccount, setRecipientBankAccount] = useState<BankAccount | null>(null);
  const [loadingBankAccount, setLoadingBankAccount] = useState<boolean>(false);
  const [recipientUsername, setRecipientUsername] = useState<string>('');
  const [mbLaosToken, setMBLaosToken] = useState<string | null>(null);
  const [mbLaosRedirectUrl, setMBLaosRedirectUrl] = useState<string | null>(null);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(INITIAL_PAYMENT_METHODS); const formatMoney = (amount: number) => {
    return formatUSDCurrency(amount);
  };

  const handleDeepLink = async ({ url }: { url: string }) => {
    console.log('[PaymentScreen] Received deep link:', url);

    const route = url.replace(/.*?:\/\//g, '');
    const [path, queryString] = route.split('?');

    // Handle payment callback (từ MBLaos quay về)
    if (path === 'pay' || path === 'payment-result') {
      // Parse query string manually (URLSearchParams not supported in some engines)
      const params: { [key: string]: string } = {};
      if (queryString) {
        queryString.split('&').forEach(param => {
          const [key, value] = param.split('=');
          if (key && value) {
            params[key] = decodeURIComponent(value);
          }
        });
      }

      const token = params.token || mbLaosToken;
      const transactionId = params.transactionId;

      console.log('[PaymentScreen] Payment callback - Token:', token ? 'exists' : 'missing', 'TXN:', transactionId);

      // ✨ Gọi API verify-status để xác minh giao dịch thực sự
      if (token) {
        try {
          console.log('[PaymentScreen] 🔍 Calling verify-status API...');

          // Nếu không có transactionId từ callback, lấy từ state hoặc tạo mới
          const txnId = transactionId || `${Date.now()}`;

          const verifyResponse = await paymentService.verifyTransactionStatus(token, txnId);

          console.log('[PaymentScreen] ✅ Verify response:', JSON.stringify(verifyResponse, null, 2));

          // Xử lý kết quả từ API verify-status
          if (verifyResponse?.code === '00' || verifyResponse?.status === 'SUCCESS') {
            // Giao dịch thành công
            showToast.success(
              t('payment_screen.payment_success'),
              t('payment_screen.payment_bank_transfer_success')
            );

            // Navigate to PaymentSuccessScreen
            setTimeout(() => {
              navigate('PaymentSuccessScreen', {
                amount: verifyResponse?.data?.amount || amount,
                transactionId: verifyResponse?.data?.transactionId || txnId,
                recipientName: recipientUsername,
                timestamp: verifyResponse?.data?.completedAt || new Date().toLocaleString('vi-VN'),
              });
            }, 500);

          } else if (verifyResponse?.status === 'PENDING') {
            // Giao dịch đang xử lý
            showToast.info(
              'Thông báo',
              'Giao dịch đang được xử lý. Vui lòng chờ...'
            );

          } else if (verifyResponse?.status === 'FAILED' || verifyResponse?.status === 'CANCELLED') {
            // Giao dịch thất bại
            showToast.error(
              t('payment_screen.payment_payment_error'),
              verifyResponse?.message || t('payment_screen.payment_general_error')
            );

          } else {
            // Trường hợp khác - hiển thị thông tin từ response
            console.log('[PaymentScreen] Unknown verify status:', verifyResponse?.status);
            showToast.info(
              'Kết quả giao dịch',
              verifyResponse?.message || 'Vui lòng kiểm tra lại giao dịch'
            );
          }

        } catch (error) {
          console.log('[PaymentScreen] ❌ Verify status error:', error);
          showToast.error(
            t('payment_screen.payment_payment_error'),
            'Không thể xác minh giao dịch. Vui lòng thử lại.'
          );
        }
      } else {
        console.log('[PaymentScreen] ⚠️ No token available for verification');
        showToast.info('Thông báo', 'Đã quay lại từ MBLaos');
      }
    }
  };


  useEffect(() => {
    const fetchRecipientData = async () => {
      if (userId) {
        setLoadingBankAccount(true);
        try {
          // Fetch user info
          const userData = await paymentService.getUserById(userId);
          if (userData) {
            setRecipientUsername(userData.username || '');
          }

          // Fetch bank account
          const bankAccount = await paymentService.getRecipientBankAccount(userId);
          if (bankAccount) {
            setRecipientBankAccount(bankAccount);
          }
        } catch (error: any) {
          console.log('[PaymentScreen] Error fetching data:', error);

          if (error?.response?.status === 404) {
            showToast.info(t('notification_screen.notification_title'), t('payment_screen.no_bank_account_message'));
            goBack();
          } else {
            showToast.error(t('error'), t('bank_screen.failed_to_load_bank_account'));
          }
        } finally {
          setLoadingBankAccount(false);
        }
      }
    };

    // ✨ Gọi API login MBLaos khi vào màn hình
    const loginToMBLaos = async () => {
      try {
        const requestBody = {
          username: 'mbbank',
          password: 'ekboh8rKhEQmN5RC/WlHpRksFomWI0zfhQXcQw/yt28vjDmPV3sWZsBCBR3gf6LjkROuX4hDLM803EEty+OZXAzwIAz5XK1FR0bQm0yH7wHbP5zPUec/5GAAkgEvgX/P4z1/OYw2Ec0ng6pwpuDlwtWRyP4AMlO4L2/tVS3pVh6Hk26gtr5HiEvGVQaX7L4m8OlqBQHk6PqLZ7pre2e2Gerlu1LU3gPAyQ8Ej3JHrImn1dPTZc/+x4wGYXcN41fce3iXwKqVCShoW7peHKXtcoPAebU8DSUQNk3M6AF22+4t9gnuqwhgB9FVdgSS6OSoVArhPRFk49VV0CGUvyTy+g=='
        };
        const response = await paymentService.loginMBLaos();
        // ✨ Lưu token vào state nếu login thành công
        if (response?.csrfToken) {
          setMBLaosToken(response.csrfToken);
          console.log('[PaymentScreen] 💾 Saved MBLaos csrfToken to state');
          // ✨ Gọi API create-redirect-url để lấy URL mở MBLaos
          // Generate random transactionId (UUID-like format)
          const transactionId = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
          const callbackUrl = `yummy://pay?token=${response.csrfToken}`;

          const redirectResponse = await paymentService.createMBLaosRedirectUrl(
            response.csrfToken,
            {
              transactionId: transactionId,
              phoneNumber: '02096497153',
              clientIp: '123.123.123',
              failUrl: callbackUrl,
              returnUrl: callbackUrl,
              successUrl: callbackUrl,
              amount: 10000,
              currency: 'LAK',
            }
          );
          // ✨ Lưu redirectUrl vào state để sử dụng khi user confirm thanh toán
          if (redirectResponse?.redirectUrl) {
            setMBLaosRedirectUrl(redirectResponse.redirectUrl);
            console.log('[PaymentScreen] 💾 Saved MBLaos redirectUrl to state');
          }
        }
      } catch (error) {
        console.log('[PaymentScreen] ❌ MBLaos login error:', error);
      }
    };

    fetchRecipientData();
    loginToMBLaos();
  }, [userId, t]);

  // ✨ Deep Link Listener - Handle callback từ MBLaos
  useEffect(() => {
    // Listen for deep links
    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      subscription.remove();
    };
  }, [t]);

  // ✨ Focus effect - Check for initial URL when screen is focused (in case app was opened via deep link)
  useFocusEffect(
    React.useCallback(() => {
      const checkInitialURL = async () => {
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl != null) {
          console.log('[PaymentScreen] Initial URL:', initialUrl);
          handleDeepLink({ url: initialUrl });
        }
      };

      checkInitialURL();
    }, [handleDeepLink])
  );

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
      showToast.error(t('payment_screen.payment_payment_error'), t('payment_screen.payment_enter_valid_amount'));
      return;
    }

    const selectedMethod = paymentMethods.find(method => method.selected);
    if (!selectedMethod) {
      showToast.error(t('payment_screen.payment_payment_error'), t('payment_screen.payment_select_payment_method'));
      return;
    }
    setSelectedPaymentMethod(selectedMethod);
    setShowPaymentConfirmation(true);
  };

  const handleProcessPayment = async () => {
    try {
      if (!mbLaosRedirectUrl) {
        showToast.error(
          'Thông báo',
          'Không thể kết nối MBLaos. Vui lòng thử lại sau.'
        );
        return;
      }
      try {
        await Linking.openURL(mbLaosRedirectUrl);
        setShowPaymentConfirmation(false);
      } catch (openError) {

        const storeUrl = Platform.select({
          ios: 'https://apps.apple.com/search?term=MB%20Laos',
          android: 'https://play.google.com/store/apps/details?id=com.mblaos',
        });

        if (storeUrl) {
          showToast.info('Thông báo', 'MBLaos chưa được cài đặt. Đang chuyển đến Store...');
          await Linking.openURL(storeUrl);
        }
        setShowPaymentConfirmation(false);
      }
    } catch (error) {
      showToast.error(t('payment_screen.payment_payment_error'), t('payment_screen.payment_general_error'));
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

  const ItemInfo = (label?: string, value?: string) => {
    return (
      <View style={styles.bankInfoRow}>
        <Text style={styles.bankInfoLabel}>{label}</Text>
        <Text style={styles.bankInfoValue}>{value}</Text>
      </View>
    );
  };

  const ItemCost = (amount: number, inputAmount: string, value?: string) => {
    return (
      <TouchableOpacity
        style={styles.quickAmountButton}
        onPress={() => { setAmount(amount); setInputAmount(inputAmount); }}
      >
        <Text style={styles.quickAmountText}>{value}</Text>
      </TouchableOpacity>
    )
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
          title={t('payment_screen.payment_title')}
          showGoBack={true}
          showNotification={false}
          isBackHome={true}
        />
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
          {/* Payment Card */}
          <View style={styles.paymentCard}>
            <View style={styles.serviceIconContainer}>
              <IconSvg xml={ImagesSvg.icHeart} width={30} height={30} color={colors.primary} />
            </View>
            <Text style={styles.serviceTitle}>{t('payment_screen.payment_title')}</Text>
            <Text style={styles.phoneNumber}>{recipientBankAccount?.accountName}</Text>
          </View>

          <View style={styles.donationCard}>
            <View style={styles.donationTitleRow}>
              <Text style={styles.donationTitle}>{t('payment_screen.payment_amount')}</Text>
            </View>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencyLabel}>$</Text>
              <TextInput
                style={styles.amountInput}
                value={inputAmount}
                onChangeText={handleAmountChange}
                keyboardType="numeric"
                placeholder={t('payment_screen.payment_enter_amount')}
                placeholderTextColor="#aaa"
              />
            </View>
            <View style={styles.quickAmountContainer}>
              {ItemCost(5, '5', '$5')}
              {ItemCost(10, '10', '$10')}
              {ItemCost(20, '20', '$20')}
            </View>
          </View>

          {/* Payment Methods Section */}
          <View style={styles.paymentMethodsSection}>
            <View style={styles.paymentMethodsHeader}>
              <Text style={styles.paymentMethodsTitle}>{t('payment_screen.payment_payment_methods')}</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>{t('payment_screen.payment_view_all')}</Text>
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
            {ItemInfo(t('bank_screen.bank_name'), recipientBankAccount?.bankName)}
            {ItemInfo(t('bank_screen.bank_code'), recipientBankAccount?.bankCode)}
            {ItemInfo(t('bank_screen.account_number'), recipientBankAccount?.accountNumber)}
            {ItemInfo(t('bank_screen.account_name'), recipientBankAccount?.accountName)}
            <View style={styles.bankInfoRow}>
              <Text style={styles.bankInfoLabel}>{t('payment_screen.transfer_note')}:</Text>
              <View style={styles.transferInputContainer}>
                <TextInput
                  style={styles.transferNoteInput}
                  placeholder={t('payment_screen.enter_transfer_note')}
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
              title={t('confirm')}
              onPress={handleConfirmPayment}
              style={styles.confirmButton}
              fontSize={18}
            />
          </View>
        </ScrollView>
        <ConfirmationModal
          visible={showPaymentConfirmation}
          title={t('payment_screen.payment_confirm_donate')}
          message={t('payment_screen.payment_confirm_message', {
            amount: formatMoney(amount),
            method: selectedPaymentMethod?.name || ''
          })}
          onClose={() => setShowPaymentConfirmation(false)}
          onConfirm={handleProcessPayment}
          confirmText={t('confirm')}
          cancelText={t('cancel')}
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
});

export default PaymentScreen;