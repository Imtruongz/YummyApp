import React from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { PaymentScreenProps } from './type';
import { usePayment } from './hooks/usePayment';
import {
  RecipientCard,
  AmountInputCard,
  PaymentMethodsList,
  BankInfoCard,
  BottomPaymentSection,
  styles,
} from './components/PaymentComponents';

import ConfirmationModal from '@/components/ConfirmationModal';
import { HomeHeader } from '@/components';
import { formatUSDCurrency } from '@/utils';

const PaymentScreen: React.FC<PaymentScreenProps> = ({ route }) => {
  const { t } = useTranslation();
  const { amount: initialAmount = 5, userId } = route.params || {};

  // =============================================
  // CUSTOM HOOK - All logic is handled here
  // =============================================
  const {
    amount,
    inputAmount,
    showPaymentConfirmation,
    selectedPaymentMethod,
    recipientBankAccount,
    recipientUsername,
    paymentMethods,
    handleAmountChange,
    handlePaymentMethodSelect,
    handleConfirmPayment,
    handleProcessPayment,
    setShowPaymentConfirmation,
    setAmount,
    setInputAmount,
  } = usePayment({ initialAmount, userId });

  // =============================================
  // HANDLERS
  // =============================================
  const handleQuickAmountSelect = (quickAmount: number, quickInputAmount: string) => {
    setAmount(quickAmount);
    setInputAmount(quickInputAmount);
  };

  // =============================================
  // RENDER
  // =============================================
  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <HomeHeader
          mode="back"
          title={t('payment_screen.payment_title')}
          showGoBack={true}
          showNotification={false}
          isBackHome={true}
        />

        {/* Content */}
        <ScrollView
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Recipient Info Card */}
          <RecipientCard accountName={recipientBankAccount?.accountName} />

          {/* Amount Input Card */}
          <AmountInputCard
            inputAmount={inputAmount}
            onAmountChange={handleAmountChange}
            onQuickAmountSelect={handleQuickAmountSelect}
          />

          {/* Payment Methods */}
          <PaymentMethodsList
            methods={paymentMethods}
            onSelect={handlePaymentMethodSelect}
          />

          {/* Bank Info Card */}
          <BankInfoCard
            recipientUsername={recipientUsername}
            bankAccount={recipientBankAccount}
          />

          {/* Bottom Payment Section */}
          <BottomPaymentSection
            formattedAmount={formatUSDCurrency(amount)}
            onConfirm={handleConfirmPayment}
          />
        </ScrollView>

        {/* Confirmation Modal */}
        <ConfirmationModal
          visible={showPaymentConfirmation}
          title={t('payment_screen.payment_confirm_donate')}
          message={t('payment_screen.payment_confirm_message', {
            amount: formatUSDCurrency(amount),
            method: selectedPaymentMethod?.name || '',
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

export default PaymentScreen;