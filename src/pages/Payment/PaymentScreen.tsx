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
  const [currentTransactionId, setCurrentTransactionId] = useState<string | null>(null);
  const [hasRedirectedToMBLaos, setHasRedirectedToMBLaos] = useState<boolean>(false);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(INITIAL_PAYMENT_METHODS); const formatMoney = (amount: number) => {
    return formatUSDCurrency(amount);
  };

  const handleDeepLink = async ({ url }: { url: string }) => {
    console.log('[PaymentScreen] 🔗 Incoming Deep Link:', url);
    const route = url.replace(/.*?:\/\//g, '');
    const [path, queryString] = route.split('?');

    if (path === 'pay') {
      const params: { [key: string]: string } = {};
      if (queryString) {
        queryString.split('&').forEach(param => {
          const [key, value] = param.split('=');
          if (key && value) {
            params[key] = decodeURIComponent(value);
          }
        });
      }

      console.log('[PaymentScreen] 🧩 Extracted Params:', params);

      const token = params.token || mbLaosToken;
      const transactionId = params.transactionId;
      const txnId = transactionId || currentTransactionId;

      console.log('[PaymentScreen] 🔑 Token used for verify:', token ? 'Found' : 'Missing');
      console.log('[PaymentScreen] 🆔 Transaction ID:', txnId);

      if (!txnId) {
        showToast.error('Lỗi', 'Không tìm thấy mã giao dịch');
        return;
      }

      try {
        let verifyResponse;
        let usedToken = token;

        // Thử verify với token hiện tại
        if (token) {
          try {
            verifyResponse = await paymentService.verifyTransactionStatus(token, txnId);
          } catch (error: any) {
            // Nếu lỗi TOKEN_EXPIRED (401), login lại để lấy token mới
            if (error?.message === 'TOKEN_EXPIRED') {
              console.log('[PaymentScreen] ⚠️ Token expired, refreshing...');
              const refreshResult = await paymentService.refreshTokenAndVerify(txnId);
              verifyResponse = refreshResult.data;
              usedToken = refreshResult.newToken;
              setMBLaosToken(refreshResult.newToken); // Cập nhật token mới vào state
            } else {
              throw error;
            }
          }
        } else {
          // Không có token, login lấy token mới luôn
          console.log('[PaymentScreen] ⚠️ No token available, logging in...');
          const refreshResult = await paymentService.refreshTokenAndVerify(txnId);
          verifyResponse = refreshResult.data;
          setMBLaosToken(refreshResult.newToken);
        }

        const transactionData = Array.isArray(verifyResponse) ? verifyResponse[0] : verifyResponse;
        const status = transactionData?.transactionStatus || transactionData?.status;

        console.log('[PaymentScreen] 📊 Transaction Status:', status);

        if (status === 'SUCCESS' || transactionData?.code === '00') {
          showToast.success('Thanh toán thành công', 'Chuyển khoản thành công!');

          setTimeout(() => {
            navigate('PaymentSuccessScreen', {
              amount: transactionData?.amount || amount,
              transactionId: transactionData?.transactionId || txnId,
              recipientName: recipientUsername,
              timestamp: transactionData?.transactionFinishTime || new Date().toLocaleString('vi-VN'),
            });
          }, 500);

        } else if (status === 'PENDING') {
          showToast.info('Thông báo', 'Giao dịch đang được xử lý. Vui lòng chờ...');
        } else if (status === 'FAILED' || status === 'CANCELLED') {
          showToast.error('Lỗi thanh toán', transactionData?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
        } else {
          showToast.info('Kết quả giao dịch', transactionData?.message || 'Vui lòng kiểm tra lại giao dịch');
        }

      } catch (error) {
        console.log('[PaymentScreen] ❌ Deep link verification error:', error);
        showToast.error('Lỗi thanh toán', 'Không thể xác minh giao dịch. Vui lòng thử lại.');
      }
    }
  };

  useEffect(() => {
    const fetchRecipientData = async () => {
      if (userId) {
        setLoadingBankAccount(true);
        try {
          const userData = await paymentService.getUserById(userId);
          if (userData) {
            setRecipientUsername(userData.username || '');
          }

          const bankAccount = await paymentService.getRecipientBankAccount(userId);
          if (bankAccount) {
            setRecipientBankAccount(bankAccount);
          }
        } catch (error: any) {
          if (error?.response?.status === 404) {
            showToast.info('Thông báo', 'Người nhận chưa liên kết tài khoản ngân hàng.');
            goBack();
          } else {
            showToast.error('Lỗi', 'Không thể tải thông tin tài khoản ngân hàng.');
          }
        } finally {
          setLoadingBankAccount(false);
        }
      }
    };

    const loginToMBLaos = async () => {
      try {
        const response = await paymentService.loginMBLaos();
        if (response?.csrfToken) {
          console.log('[PaymentScreen] 🔑 Got new MBLaos Token:', response.csrfToken);
          setMBLaosToken(response.csrfToken);
          const transactionId = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
          setCurrentTransactionId(transactionId);
          paymentService.registerTransactionWithServer(transactionId, 10000, userId);
          const callbackUrl = `yummy://pay?token=${encodeURIComponent(response.csrfToken)}&transactionId=${transactionId}`;

          const redirectResponse = await paymentService.createMBLaosRedirectUrl(
            response.csrfToken,
            {
              transactionId: transactionId,
              phoneNumber: '02096497153',
              clientIp: '123.123.123',
              failUrl: callbackUrl,
              returnUrl: callbackUrl,
              successUrl: callbackUrl,
              amount: 1000,
              currency: 'LAK',
            }
          );
          if (redirectResponse?.redirectUrl) {
            setMBLaosRedirectUrl(redirectResponse.redirectUrl);
          }
        }
      } catch (error) {
        console.log('[PaymentScreen] ❌ MBLaos login error:', error);
      }
    };

    fetchRecipientData();
    loginToMBLaos();
  }, [userId, t]);

  useEffect(() => {
    const subscription = Linking.addEventListener('url', handleDeepLink);
    return () => subscription.remove();
  }, [t]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const checkStatus = async () => {
      if (currentTransactionId && mbLaosToken) {
        try {
          let verifyResponse;

          try {
            verifyResponse = await paymentService.verifyTransactionStatus(mbLaosToken, currentTransactionId);
          } catch (error: any) {
            // Nếu token hết hạn, login lại và verify
            if (error?.message === 'TOKEN_EXPIRED') {
              console.log('[PaymentScreen] ⚠️ Polling: Token expired, refreshing...');
              const refreshResult = await paymentService.refreshTokenAndVerify(currentTransactionId);
              verifyResponse = refreshResult.data;
              setMBLaosToken(refreshResult.newToken);
            } else {
              throw error;
            }
          }

          const transactionData = Array.isArray(verifyResponse) ? verifyResponse[0] : verifyResponse;
          const status = transactionData?.transactionStatus || transactionData?.status;

          console.log('[PaymentScreen] 📊 Polling status:', status);

          if (status === 'SUCCESS' || transactionData?.code === '00') {
            setCurrentTransactionId(null);

            showToast.success('Thanh toán thành công', 'Chuyển khoản thành công!');

            navigate('PaymentSuccessScreen', {
              amount: transactionData?.amount || amount,
              transactionId: transactionData?.transactionId || currentTransactionId,
              recipientName: recipientUsername,
              timestamp: transactionData?.transactionFinishTime || new Date().toLocaleString('vi-VN'),
            });
          }
        } catch (err) {
          console.log('[PaymentScreen] ❌ Polling error:', err);
        }
      }
    };

    // ✨ Chỉ bắt đầu polling SAU KHI user đã được redirect sang MBLaos
    if (currentTransactionId && hasRedirectedToMBLaos) {
      checkStatus();
      intervalId = setInterval(checkStatus, 5000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [currentTransactionId, mbLaosToken, recipientUsername, amount, navigate, t, hasRedirectedToMBLaos]);

  useFocusEffect(
    React.useCallback(() => {
      const checkInitialURL = async () => {
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl != null) {
          handleDeepLink({ url: initialUrl });
        }
      };

      checkInitialURL();
    }, [handleDeepLink])
  );

  const handleProcessPayment = async () => {
    try {
      if (!mbLaosRedirectUrl) {
        showToast.error('Thông báo', 'Không thể kết nối MBLaos. Vui lòng thử lại sau.');
        return;
      }
      try {
        await Linking.openURL(mbLaosRedirectUrl);
        setHasRedirectedToMBLaos(true); // ✨ Bắt đầu polling từ lúc này
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
      showToast.error('Lỗi thanh toán', 'Có lỗi xảy ra. Vui lòng thử lại.');
    }
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
      showToast.error('Lỗi thanh toán', 'Vui lòng nhập số tiền hợp lệ.');
      return;
    }

    const selectedMethod = paymentMethods.find(method => method.selected);
    if (!selectedMethod) {
      showToast.error('Lỗi thanh toán', 'Vui lòng chọn phương thức thanh toán.');
      return;
    }
    setSelectedPaymentMethod(selectedMethod);
    setShowPaymentConfirmation(true);
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