import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  Linking
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../android/types/StackNavType';
const AntDesignIcon = require('react-native-vector-icons/AntDesign').default;
const IoniconsIcon = require('react-native-vector-icons/Ionicons').default;
const MaterialCommunityIcons = require('react-native-vector-icons/MaterialCommunityIcons').default;
import { MMKV } from 'react-native-mmkv';
import colors from '../utils/color';
// import { ZaloPayLogo, BIDVLogo, CoinIcon } from '../components/icons/PaymentIcons';

import api from '../api/config'

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
  cardNumber?: string;
  cardType?: string;
}

const storage = new MMKV();

const PaymentScreen: React.FC<PaymentScreenProps> = ({ navigation, route }) => {
  const { amount = 20000, phoneNumber = '0363704403', serviceType = 'Nạp ĐT', serviceProvider = 'Viettel' } = route.params || {};
  
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 'zalopay',
      name: 'Ví Zalopay',
      iconType: 'custom',
      balance: '685.009đ',
      selected: true
    },
    {
      id: 'mblaos',
      name: 'MBLaos',
      iconType: 'custom',
      selected: true
    },
    {
      id: 'bank',
      name: 'Tài khoản trả sau',
      iconType: 'materialcommunity',
      iconName: 'bank',
      iconColor: '#00a86b',
    },
    {
      id: 'bidv',
      name: '***6024',
      iconType: 'custom',
      cardType: 'BIDV'
    }
  ]);

  const formatMoney = (amount: number) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
  };

  const handlePaymentMethodSelect = async (id: string) => {
       try {
      const response = await api.post('/payment/create-session', {
        amount: 75000,
        description: 'Thanh toán đơn hàng YummyApp từ Setting',
        merchantName: 'YummyFood',
      });

      const data = response.data;

      if (data.success && data.token) {
        const url = `mblaos://pay?token=${data.token}`;
        console.log('Opening URL with dynamic token:', url);
        await Linking.openURL(url);
      } else {
        console.log('Không thể tạo token động');
      }
    } catch (error) {
      console.error('Error opening MBLaos app:', error);
    }
    const updatedMethods = paymentMethods.map(method => ({
      ...method,
      selected: method.id === id
    }));
    setPaymentMethods(updatedMethods);
  };

  const handleConfirmPayment = () => {
    // Lấy tên phương thức thanh toán được chọn
    const selectedMethod = paymentMethods.find(method => method.selected);
    const paymentMethodName = selectedMethod ? selectedMethod.name : 'Ví Zalopay';
    
    Alert.alert(
      "Xác nhận thanh toán",
      `Bạn có chắc muốn thanh toán ${formatMoney(amount)} cho ${serviceType} ${phoneNumber} bằng ${paymentMethodName}?`,
      [
        {
          text: "Hủy",
          style: "cancel"
        },
        {
          text: "Xác nhận",
          onPress: () => {
            // Simulate successful payment
            setTimeout(() => {
              Alert.alert(
                "Thanh toán thành công",
                `Bạn đã thanh toán thành công ${formatMoney(amount)} cho ${serviceType} ${phoneNumber} bằng ${paymentMethodName}`,
                [
                  {
                    text: "OK",
                    onPress: () => navigation.goBack()
                  }
                ]
              );
            }, 1000);
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
          // return <ZaloPayLogo width={30} height={30} />;
        } else if (method.id === 'bidv') {
          // return <BIDVLogo width={30} height={30} />;
        }
        return null;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#0055ff" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <IoniconsIcon name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Xác nhận giao dịch</Text>
      </View>

      {/* Payment Card */}
            <View style={styles.paymentCard}>
        <View style={styles.serviceIconContainer}>
          {serviceType.toLowerCase().includes('dịch vụ') ? (
            <IoniconsIcon name="cart-outline" size={30} color="#0055ff" />
          ) : (
            <IoniconsIcon name="phone-portrait-outline" size={30} color="#0055ff" />
          )}
        </View>
        <Text style={styles.serviceTitle}>{serviceType}</Text>
        <Text style={styles.phoneNumber}>{phoneNumber}</Text>
      </View>

      {/* Discount Section */}
      <View style={styles.discountCard}>
        <View style={styles.discountLeft}>
          <View style={styles.coinIconContainer}>
            {/* <CoinIcon width={24} height={24} /> */}
          </View>
          <View>
            <Text style={styles.discountTitle}>Giảm 200đ từ xu</Text>
            <Text style={styles.discountSubtitle}>Dùng 200 xu</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.discountButton}>
          <Text style={styles.discountButtonText}>Chọn</Text>
        </TouchableOpacity>
      </View>

      {/* Payment Methods Section */}
      <View style={styles.paymentMethodsSection}>
        <View style={styles.paymentMethodsHeader}>
          <Text style={styles.paymentMethodsTitle}>Phương thức thanh toán</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>Xem tất cả</Text>
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
        <IoniconsIcon name="information-circle" size={24} color="#0055ff" />
        <View style={styles.infoMessageContent}>
          <Text style={styles.infoMessageText}>
            Chi tiêu thoải mái hơn khi chọn mua trước trả sau đến 37 ngày.
          </Text>
          <TouchableOpacity>
            <Text style={styles.infoMessageAction}>Chọn ngay</Text>
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
          <Text style={styles.confirmButtonText}>Xác nhận</Text>
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
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0055ff',
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
    marginRight: 30,
  },
  paymentCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: -16,
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
    backgroundColor: '#e6f0ff',
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
    backgroundColor: '#ffffff',
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
    borderColor: '#0055ff',
  },
  discountButtonText: {
    color: '#0055ff',
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
    color: '#0055ff',
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
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  paymentMethodCardSelected: {
    borderColor: '#0055ff',
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
    backgroundColor: '#0055ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoMessageCard: {
    flexDirection: 'row',
    backgroundColor: '#e6f0ff',
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
    color: '#0055ff',
    fontWeight: '600',
    marginTop: 4,
  },
  bottomPaymentSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
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
    backgroundColor: '#1cc865',
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
  phoneNumber: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default PaymentScreen;