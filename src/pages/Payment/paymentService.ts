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

export const loginMBLaos = async () => {
  try {
    const MBLAOS_LOGIN_URL = 'http://qa-mb-laos-gateway-api.evotek.vn/api/gateway/v1/authenticate/client/login';
    console.log('[paymentService] 🔐 Calling MBLaos login API...');
    const response = await fetch(MBLAOS_LOGIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'DEVICE_TOKEN': 'yummy-app-device-token',
        'CLIENT_MESSAGE_ID': 'eb01d31e-30b4-4b7e-aa41-90bdea11f0ea',
      },
      body: JSON.stringify({
        username: 'lottery',
        password: 'ekboh8rKhEQmN5RC/WlHpRksFomWI0zfhQXcQw/yt28vjDmPV3sWZsBCBR3gf6LjkROuX4hDLM803EEty+OZXAzwIAz5XK1FR0bQm0yH7wHbP5zPUec/5GAAkgEvgX/P4z1/OYw2Ec0ng6pwpuDlwtWRyP4AMlO4L2/tVS3pVh6Hk26gtr5HiEvGVQaX7L4m8OlqBQHk6PqLZ7pre2e2Gerlu1LU3gPAyQ8Ej3JHrImn1dPTZc/+x4wGYXcN41fce3iXwKqVCShoW7peHKXtcoPAebU8DSUQNk3M6AF22+4t9gnuqwhgB9FVdgSS6OSoVArhPRFk49VV0CGUvyTy+g=='
      }),
    });

    const data = await response.json();
    console.log('[paymentService] ✅ MBLaos login response:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.log('[paymentService] Error calling MBLaos login API:', error);
    throw error;
  }
};

export const createMBLaosRedirectUrl = async (
  csrfToken: string,
  params: {
    transactionId: string;
    phoneNumber: string;
    failUrl: string;
    returnUrl: string;
    successUrl: string;
    amount: number;
    currency?: string;
    clientIp?: string;
  }
) => {
  try {
    const MBLAOS_REDIRECT_URL = 'http://qa-mb-laos-gateway-api.evotek.vn/api/gateway/v1/client/inter-app/create-redirect-url';

    const requestBody = {
      transactionId: params.transactionId,
      clientIp: params.clientIp || '127.0.0.1',
      phoneNumber: params.phoneNumber,
      failUrl: params.failUrl,
      returnUrl: params.returnUrl,
      successUrl: params.successUrl,
      amount: params.amount,
      currency: params.currency || 'LAK',
    };


    console.log('[paymentService] 📤 Create Redirect URL Request:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(MBLAOS_REDIRECT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${csrfToken}`,
        'DEVICE_TOKEN': 'yummy-app-device-token',
        'CLIENT_MESSAGE_ID': params.transactionId,
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    console.log('[paymentService] 📥 Create Redirect URL Response:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.log('[paymentService] Error calling MBLaos create-redirect-url API:', error);
    throw error;
  }
};

/**
 * Verify transaction status with MBLaos Gateway
 * @param csrfToken - Authentication token from login
 * @param transactionId - The transaction ID to verify
 * @returns Transaction status response
 */
export const verifyTransactionStatus = async (
  csrfToken: string,
  transactionId: string
) => {
  try {
    const MBLAOS_VERIFY_URL = 'http://qa-mb-laos-gateway-api.evotek.vn/api/gateway/v1/client/transaction/verify-status';

    console.log('[paymentService] 🔍 Verifying transaction status...');
    console.log('[paymentService] Transaction ID:', transactionId);

    const response = await fetch(MBLAOS_VERIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${csrfToken}`,
        'DEVICE_TOKEN': 'yummy-app-device-token',
        'CLIENT_MESSAGE_ID': transactionId,
      },
      body: JSON.stringify({
        transactionId: transactionId,
      }),
    });

    const data = await response.json();
    console.log('[paymentService] 📥 Verify Status Response:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.log('[paymentService] Error calling MBLaos verify-status API:', error);
    throw error;
  }
};
