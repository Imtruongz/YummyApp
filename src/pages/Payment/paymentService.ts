import api from '@/api/config';
import { BankAccount } from './type';

/**
 * Get user information by ID
 */
export const getUserById = async (userId: string) => {
  try {
    const response = await api.get(`users/getUserById/${userId}`);
    if (response.data && response.data.success) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.log('[paymentService] Error fetching user:', error);
    throw error;
  }
};

/**
 * Get recipient bank account
 */
export const getRecipientBankAccount = async (userId: string): Promise<BankAccount | null> => {
  try {
    const response = await api.get(`bank-accounts/${userId}`);
    if (response.data && response.data.success && response.data.data) {
      console.log('[paymentService] Fetched recipient bank account:', response.data.data);
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.log('[paymentService] Error fetching recipient bank account:', error);
    throw error;
  }
};

/**
 * Record bank transfer payment
 */
export const recordBankTransfer = async (
  amount: number,
  recipientUsername: string,
  receiverId: string,
  bankAccountInfo: BankAccount
) => {
  try {
    const response = await api.post('/payment/record-bank-transfer', {
      amount: amount,
      description: `Donate $${amount} cho ${recipientUsername} qua YummyApp`,
      receiverId: receiverId,
      bankAccountInfo: bankAccountInfo
    });
    return response.data;
  } catch (error) {
    console.log('[paymentService] Error recording bank transfer:', error);
    throw error;
  }
};

/**
 * Create payment session for MBLaos
 */
export const createPaymentSession = async (
  amount: number,
  receiverId: string
) => {
  try {
    const response = await api.post('/payment/create-session', {
      amount: amount,
      description: `Donate $${amount} cho người dùng qua YummyApp`,
      merchantName: 'YummyFood',
      receiverId: receiverId,
    });
    return response.data;
  } catch (error) {
    console.log('[paymentService] Error creating payment session:', error);
    throw error;
  }
};
