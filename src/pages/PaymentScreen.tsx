import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  Alert,
  Linking,
  TextInput,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { formatUSDCurrency, extractNumbersOnly } from '../utils/regexPatterns';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../android/types/StackNavType';
const AntDesignIcon = require('react-native-vector-icons/AntDesign').default;
const IoniconsIcon = require('react-native-vector-icons/Ionicons').default;
const MaterialCommunityIcons = require('react-native-vector-icons/MaterialCommunityIcons').default;
import colors from '../utils/color';
import HomeHeader from '../components/HomeHeader';
import api from '../api/config';
import { BIDVLogo, MBLogo, ZaloPayLogo } from '../utils/assets';

type PaymentScreenProps = NativeStackScreenProps<RootStackParamList, 'PaymentScreen'>;
interface PaymentMethod {
  id: string;
  name: string;
  iconType: 'ionicons' | 'antdesign' | 'materialcommunity' | 'image' | 'custom';
  iconName?: string;
  iconColor?: string;
  imagePath?: any;
  balance?: string;
  selected?: boolean;
  integrated?: boolean; // Thêm trường đánh dấu phương thức đã được tích hợp
  cardNumber?: string;
  cardType?: string;
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({ navigation, route }) => {
  const { amount: initialAmount = 5, phoneNumber = '0363704403', serviceType = 'Donate', serviceProvider = 'Yummy' } = route.params || {};
  const [amount, setAmount] = useState<number>(initialAmount);
  const [inputAmount, setInputAmount] = useState<string>(initialAmount.toString());
  const { t } = useTranslation();

  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });
    return () => navigation.getParent()?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 'zalopay',
      name: 'Ví Zalopay',
      iconType: 'custom',
      selected: false,
      integrated: false // Chưa tích hợp
    },
    {
      id: 'mblaos',
      name: 'MBLaos',
      iconType: 'custom',
      selected: true,
      integrated: true // Đã tích hợp
    },
    {
      id: 'bank',
      name: 'Tài khoản trả sau',
      iconType: 'materialcommunity',
      iconName: 'bank',
      iconColor: '#00a86b',
      integrated: false // Chưa tích hợp
    },
    {
      id: 'bidv',
      name: 'BIDV',
      iconType: 'custom',
      cardType: 'BIDV',
      integrated: false // Chưa tích hợp
    }
  ]);

  // Sử dụng hàm từ regexPatterns thay vì định nghĩa lại
  const formatMoney = (amount: number) => {
    return formatUSDCurrency(amount);
  };

  const handleAmountChange = (text: string) => {
    // Sử dụng hàm từ regexPatterns để chỉ lấy số
    const numericValue = extractNumbersOnly(text);
    setInputAmount(numericValue);

    if (numericValue) {
      setAmount(parseInt(numericValue, 10));
    } else {
      setAmount(0); // Hoặc giá trị mặc định khác nếu input trống
    }
  };

  const handlePaymentMethodSelect = (id: string) => {
    // Chỉ cập nhật UI để đánh dấu phương thức thanh toán được chọn
    const updatedMethods = paymentMethods.map(method => ({
      ...method,
      selected: method.id === id
    }));
    setPaymentMethods(updatedMethods);
  };

  const handleConfirmPayment = async () => {
    // Kiểm tra nếu amount là 0 hoặc không hợp lệ
    if (!amount || amount <= 0) {
      Alert.alert(
        t('payment_payment_error'),
        t('payment_enter_valid_amount'),
        [{ text: "OK" }]
      );
      return;
    }

    // Lấy phương thức thanh toán được chọn
    const selectedMethod = paymentMethods.find(method => method.selected);
    if (!selectedMethod) {
      Alert.alert(
        t('payment_payment_error'),
        t('payment_select_payment_method'),
        [{ text: "OK" }]
      );
      return;
    }

    const paymentMethodName = selectedMethod.name;

    Alert.alert(
      t('payment_confirm_donate'),
      t('payment_confirm_message', { amount: formatMoney(amount), method: paymentMethodName }),
      [
        {
          text: t('payment_cancel'),
          style: "cancel"
        },
        {
          text: t('payment_confirm'),
          onPress: async () => {
            try {
              if (selectedMethod.integrated) {
                const response = await api.post('/payment/create-session', {
                  amount: amount,
                  description: `Donate $${amount} cho người dùng qua YummyApp`,
                  merchantName: 'YummyFood',
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
              } else {
                Alert.alert(
                  t('payment_simulation_notice'),
                  t('payment_method_not_integrated', { method: paymentMethodName }),
                  [
                    {
                      text: "OK",
                    }
                  ]
                );
              }
            } catch (error) {
              console.error('Lỗi khi thanh toán:', error);
              Alert.alert(
                t('payment_payment_error'),
                t('payment_general_error'),
                [{ text: "OK" }]
              );
            }
          }
        }
      ]
    );
  };

  // Render icon based on type
  const renderIcon = (method: PaymentMethod) => {
    switch (method.iconType) {
      case 'ionicons':
        return method.iconName ? <IoniconsIcon name={method.iconName} size={30} color={method.iconColor || '#000'} /> : null;
      case 'antdesign':
        return method.iconName ? <AntDesignIcon name={method.iconName} size={30} color={method.iconColor || '#000'} /> : null;
      case 'materialcommunity':
        return method.iconName ? <MaterialCommunityIcons name={method.iconName} size={30} color={method.iconColor || '#000'} /> : null;
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
    <SafeAreaView style={styles.container}>
      <HomeHeader
        mode="back"
        title={t('payment_title')}
        showGoBack={true}
        showNotification={false}
      />

      {/* Payment Card */}
      <View style={styles.paymentCard}>
        <View style={styles.serviceIconContainer}>
          <IoniconsIcon name="heart-outline" size={30} color={colors.primary} />
        </View>
        <Text style={styles.serviceTitle}>{t('payment_title')}</Text>
        <Text style={styles.phoneNumber}>{phoneNumber}</Text>
      </View>

      {/* Donation Amount Input Card */}
      <View style={styles.donationCard}>
        <View style={styles.donationTitleRow}>
          <IoniconsIcon name="cash-outline" size={24} color={colors.primary} />
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
              {method.selected && (
                <View style={styles.selectedCheckmark}>
                  <AntDesignIcon name="check" size={16} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Info Message */}
      <View style={styles.infoMessageCard}>
        <IoniconsIcon name="information-circle" size={24} color={colors.primary} />
        <View style={styles.infoMessageContent}>
          <Text style={styles.infoMessageText}>
            {t('payment_credit_message')}
          </Text>
          <TouchableOpacity>
            <Text style={styles.infoMessageAction}>{t('payment_choose_now')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Payment Button */}
      <View style={styles.bottomPaymentSection}>
        <View style={styles.totalAmount}>
          <Text style={styles.totalAmountText}>{formatMoney(amount)}</Text>
          <IoniconsIcon name="chevron-up" size={24} color="#000" />
        </View>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmPayment}>
          <IoniconsIcon name="shield-checkmark" size={24} color="#fff" />
          <Text style={styles.confirmButtonText}>{t('payment_confirm')}</Text>
        </TouchableOpacity>
      </View>
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
    shadowColor: '#000',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
  },
  serviceIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary + '20', // 20% opacity của màu primary
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  amountText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0d1117',
    marginVertical: 8,
  },
  serviceText: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    width: '100%',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 16,
    color: '#64748b',
  },
  detailValue: {
    fontSize: 16,
    color: '#0d1117',
    fontWeight: '500',
  },
  discountCard: {
    flexDirection: 'row',
    backgroundColor: colors.light,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  discountLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinIconContainer: {
    marginRight: 12,
  },
  coinIcon: {
    width: 36,
    height: 36,
  },
  discountTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0d1117',
  },
  discountSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  discountButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  discountButtonText: {
    color: colors.primary,
    fontWeight: '600',
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
  },
  paymentMethodBalance: {
    position: 'absolute',
    bottom: -15,
    left: 38,
    fontSize: 13,
    color: '#64748b',
  },
  selectedCheckmark: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoMessageCard: {
    flexDirection: 'row',
    backgroundColor: colors.primary + '15', // 15% opacity của màu primary
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  infoMessageContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoMessageText: {
    fontSize: 14,
    color: '#0d1117',
    flex: 1,
  },
  infoMessageAction: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 4,
  },
  bottomPaymentSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.light,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
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
    paddingHorizontal: 24,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
    marginLeft: 8,
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
});

export default PaymentScreen;