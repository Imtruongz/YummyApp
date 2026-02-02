import api from '@/api/config';
import { BankAccount } from './type';

//Yummy API
const YUMMI_API_ENDPOINTS = {
  GET_USER_BY_ID: 'users/getUserById',
  GET_BANK_ACCOUNT: 'bank-accounts',
  REGISTER_TRANSACTION: 'payment/register-transaction',
};

//MBLaos API
const MBLAOS_BASE_URL = 'http://qa-mb-laos-gateway-api.evotek.vn/api/gateway/v1';
const MBLAOS_ENDPOINTS = {
  LOGIN: `${MBLAOS_BASE_URL}/authenticate/client/login`,
  CREATE_REDIRECT_URL: `${MBLAOS_BASE_URL}/client/inter-app/create-redirect-url`,
  VERIFY_TRANSACTION: `${MBLAOS_BASE_URL}/client/inter-app/transaction/verify-status`,
};

const MBLAOS_DEVICE_TOKEN = 'yummy-app-device-token';

const getMBLaosHeaders = (options?: {
  csrfToken?: string;
  clientMessageId?: string;
}): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'DEVICE_TOKEN': MBLAOS_DEVICE_TOKEN,
  };

  if (options?.csrfToken) {
    headers['Authorization'] = `Bearer ${options.csrfToken}`;
  }

  if (options?.clientMessageId) {
    headers['CLIENT_MESSAGE_ID'] = options.clientMessageId;
  }

  return headers;
};

export const getUserById = async (userId: string) => {
  try {
    const response = await api.get(`${YUMMI_API_ENDPOINTS.GET_USER_BY_ID}/${userId}`);
    if (response.data && response.data.success) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.log('[paymentService] Error fetching user:', error);
    throw error;
  }
};

export const getRecipientBankAccount = async (userId: string): Promise<BankAccount | null> => {
  try {
    const response = await api.get(`${YUMMI_API_ENDPOINTS.GET_BANK_ACCOUNT}/${userId}`);
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

export const registerTransactionWithServer = async (
  transactionId: string,
  amount: number,
  userId?: string
) => {
  try {
    const response = await api.post(YUMMI_API_ENDPOINTS.REGISTER_TRANSACTION, {
      transactionId,
      amount,
      userId
    });
    console.log('[paymentService] 📝 Registered transaction with server:', response.data);
    return response.data;
  } catch (error) {
    console.log('[paymentService] ❌ Failed to register transaction with server:', error);
  }
};

export const loginMBLaos = async () => {
  try {
    const response = await fetch(MBLAOS_ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: getMBLaosHeaders({
        clientMessageId: 'eb01d31e-30b4-4b7e-aa41-90bdea11f0ea',
      }),
      body: JSON.stringify({
        username: 'lottery',
        password: 'ekboh8rKhEQmN5RC/WlHpRksFomWI0zfhQXcQw/yt28vjDmPV3sWZsBCBR3gf6LjkROuX4hDLM803EEty+OZXAzwIAz5XK1FR0bQm0yH7wHbP5zPUec/5GAAkgEvgX/P4z1/OYw2Ec0ng6pwpuDlwtWRyP4AMlO4L2/tVS3pVh6Hk26gtr5HiEvGVQaX7L4m8OlqBQHk6PqLZ7pre2e2Gerlu1LU3gPAyQ8Ej3JHrImn1dPTZc/+x4wGYXcN41fce3iXwKqVCShoW7peHKXtcoPAebU8DSUQNk3M6AF22+4t9gnuqwhgB9FVdgSS6OSoVArhPRFk49VV0CGUvyTy+g=='
      }),
    });

    const data = await response.json();
    console.log('[paymentService] 🔑 MBLaos Login Response:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.log('[paymentService] ❌ MBLaos Login Error:', error);
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

    const response = await fetch(MBLAOS_ENDPOINTS.CREATE_REDIRECT_URL, {
      method: 'POST',
      headers: getMBLaosHeaders({
        csrfToken,
        clientMessageId: params.transactionId,
      }),
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    console.log('[paymentService] 📥 Create Redirect URL Response:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.log('[paymentService] ❌ Create Redirect URL Error:', error);
    throw error;
  }
};

export const verifyTransactionStatus = async (
  csrfToken: string,
  transactionId: string
) => {
  try {
    console.log('[paymentService] 🔍 Verifying Transaction ID:', transactionId);
    console.log('[paymentService] 🔑 Using Token:', csrfToken ? 'Present' : 'Missing');

    const response = await fetch(MBLAOS_ENDPOINTS.VERIFY_TRANSACTION, {
      method: 'POST',
      headers: getMBLaosHeaders({
        csrfToken,
        clientMessageId: transactionId,
      }),
      body: JSON.stringify({
        transactionId: transactionId,
      }),
    });

    console.log('[paymentService] 📊 Response Status:', response.status);

    // Nếu 401, có thể token hết hạn
    if (response.status === 401) {
      console.log('[paymentService] ⚠️ Token expired (401), need to re-login');
      throw new Error('TOKEN_EXPIRED');
    }

    const data = await response.json();
    console.log('[paymentService] 📥 Verify Response:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.log('[paymentService] ❌ Verify error for', transactionId, ':', error);
    throw error;
  }
};

/**
 * Login lại để lấy token mới và verify transaction
 * Sử dụng khi token cũ bị hết hạn (lỗi 401)
 */
export const refreshTokenAndVerify = async (
  transactionId: string
): Promise<{ data: any; newToken: string }> => {
  try {
    console.log('[paymentService] 🔄 Refreshing token and verifying transaction...');

    // Step 1: Login lại để lấy token mới
    const loginResponse = await loginMBLaos();

    if (!loginResponse?.csrfToken) {
      throw new Error('Failed to get new token from MBLaos');
    }

    const newToken = loginResponse.csrfToken;
    console.log('[paymentService] ✅ Got new token after refresh');

    // Step 2: Verify với token mới
    const verifyResponse = await verifyTransactionStatus(newToken, transactionId);

    return {
      data: verifyResponse,
      newToken: newToken,
    };
  } catch (error) {
    console.log('[paymentService] ❌ Refresh and verify failed:', error);
    throw error;
  }
};
