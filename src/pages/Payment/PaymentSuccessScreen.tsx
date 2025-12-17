import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import {colors, navigate, formatUSDCurrency} from '@/utils';
import LinearGradient from 'react-native-linear-gradient';

const PaymentSuccessScreen = ({ route, navigation }: any) => {
  const { t } = useTranslation();
  
  // Get data from route params
  const { 
    amount = 0, 
    transactionId = '#N/A',
    recipientName = 'Unknown',
    timestamp = new Date().toLocaleString('vi-VN')
  } = route?.params || {};

  const handleGoHome = () => {
    navigate('HomeScreen');
  };

  return (
    <LinearGradient
      colors={[colors.primary, colors.primaryHover, colors.light]}
      locations={[0, 0.2, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.gradientBg}
    >
      <View style={styles.container}>
        <View style={styles.successCircle}>
          <View style={styles.checkIconWrapper}>
            {/* <MaterialIcons name="done" size={60} color={colors.success} /> */}
          </View>
        </View>
        <Text style={styles.title}>{t('payment_screen.payment_success_title')}</Text>
        <Text style={styles.message}>{t('payment_screen.payment_success_message')}</Text>
        <View style={styles.detailBox}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t('payment_screen.amount')}</Text>
            <Text style={styles.detailValue}>${amount}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t('payment_screen.transaction_code')}</Text>
            <Text style={styles.detailValue}>{transactionId}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t('payment_screen.recipient')}</Text>
            <Text style={styles.detailValue}>{recipientName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t('payment_screen.payment_time')}</Text>
            <Text style={styles.detailValue}>{timestamp}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleGoHome}>
          <Text style={styles.buttonText}>{t('back_to_home')}</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBg: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  successCircle: {
    backgroundColor: '#fbe7c6', // vàng nhạt
    borderRadius: 80,
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    borderWidth: 6,
    borderColor: colors.light,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  checkIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.light,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: colors.light,
    marginBottom: 32,
    textAlign: 'center',
  },
  detailBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 18,
    marginBottom: 32,
    width: '100%',
    maxWidth: 340,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 15,
    color: '#888',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 48,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: colors.light,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

export default PaymentSuccessScreen;
