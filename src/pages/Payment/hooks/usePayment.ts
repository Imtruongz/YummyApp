import { useState, useEffect, useCallback } from 'react';
import { Linking, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import * as paymentService from '../paymentService';
import { PaymentMethod, BankAccount, INITIAL_PAYMENT_METHODS } from '../type';
import { showToast, goBack, navigate } from '@/utils';

interface UsePaymentProps {
    initialAmount: number;
    userId?: string;
}

interface UsePaymentReturn {
    // State
    amount: number;
    inputAmount: string;
    showPaymentConfirmation: boolean;
    selectedPaymentMethod: PaymentMethod | null;
    recipientBankAccount: BankAccount | null;
    loadingBankAccount: boolean;
    recipientUsername: string;
    paymentMethods: PaymentMethod[];
    mbLaosRedirectUrl: string | null;

    // Handlers
    handleAmountChange: (text: string) => void;
    handlePaymentMethodSelect: (id: string) => void;
    handleConfirmPayment: () => void;
    handleProcessPayment: () => Promise<void>;
    setShowPaymentConfirmation: (show: boolean) => void;
    setAmount: (amount: number) => void;
    setInputAmount: (input: string) => void;
}

export const usePayment = ({ initialAmount, userId }: UsePaymentProps): UsePaymentReturn => {
    // =============================================
    // STATE
    // =============================================
    const [amount, setAmount] = useState<number>(initialAmount);
    const [inputAmount, setInputAmount] = useState<string>(initialAmount.toString());
    const [showPaymentConfirmation, setShowPaymentConfirmation] = useState<boolean>(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
    const [recipientBankAccount, setRecipientBankAccount] = useState<BankAccount | null>(null);
    const [loadingBankAccount, setLoadingBankAccount] = useState<boolean>(false);
    const [recipientUsername, setRecipientUsername] = useState<string>('');
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(INITIAL_PAYMENT_METHODS);

    // MBLaos State
    const [mbLaosToken, setMBLaosToken] = useState<string | null>(null);
    const [mbLaosRedirectUrl, setMBLaosRedirectUrl] = useState<string | null>(null);
    const [currentTransactionId, setCurrentTransactionId] = useState<string | null>(null);
    const [hasRedirectedToMBLaos, setHasRedirectedToMBLaos] = useState<boolean>(false);

    // =============================================
    // DEEP LINK HANDLER
    // =============================================
    const handleDeepLink = useCallback(async ({ url }: { url: string }) => {
        const route = url.replace(/.*?:\/\//g, '');
        const [path, queryString] = route.split('?');

        if (path !== 'pay') return;

        // Parse query params
        const params = parseQueryString(queryString);
        const token = params.token || mbLaosToken;
        const txnId = params.transactionId || currentTransactionId;

        if (!txnId) {
            showToast.error('Lỗi', 'Không tìm thấy mã giao dịch');
            return;
        }

        await verifyAndHandleTransaction(token, txnId);
    }, [mbLaosToken, currentTransactionId, amount, recipientUsername]);

    // =============================================
    // HELPER FUNCTIONS
    // =============================================
    const parseQueryString = (queryString: string): Record<string, string> => {
        const params: Record<string, string> = {};
        if (!queryString) return params;

        queryString.split('&').forEach(param => {
            const [key, value] = param.split('=');
            if (key && value) {
                params[key] = decodeURIComponent(value);
            }
        });
        return params;
    };

    const verifyAndHandleTransaction = async (token: string | null, txnId: string) => {
        try {
            if (!token) {
                showToast.error('Lỗi', 'Không có token xác thực');
                return;
            }

            let verifyResponse;
            try {
                verifyResponse = await paymentService.verifyTransactionStatus(token, txnId);
            } catch (error: any) {
                // Auto re-login if TOKEN_EXPIRED
                if (error.message === 'TOKEN_EXPIRED') {
                    const newToken = await refreshToken();
                    if (newToken) {
                        verifyResponse = await paymentService.verifyTransactionStatus(newToken, txnId);
                    } else {
                        throw new Error('Failed to refresh token');
                    }
                } else {
                    throw error;
                }
            }

            const transactionData = Array.isArray(verifyResponse) ? verifyResponse[0] : verifyResponse;
            const status = transactionData?.transactionStatus || transactionData?.status;

            handleTransactionStatus(status, transactionData, txnId);
        } catch (error) {
            showToast.error('Lỗi thanh toán', 'Không thể xác minh giao dịch. Vui lòng thử lại.');
        }
    };

    // Helper function to refresh token
    const refreshToken = async (): Promise<string | null> => {
        try {
            const response = await paymentService.loginMBLaos();
            if (response?.csrfToken) {
                setMBLaosToken(response.csrfToken);
                return response.csrfToken;
            }
            return null;
        } catch (error) {
            return null;
        }
    };

    const handleTransactionStatus = (
        status: string | undefined,
        transactionData: any,
        txnId: string
    ) => {
        switch (status) {
            case 'SUCCESS':
                showToast.success('Thanh toán thành công', 'Chuyển khoản thành công!');
                setTimeout(() => {
                    navigate('PaymentSuccessScreen', {
                        amount: transactionData?.amount || amount,
                        transactionId: transactionData?.transactionId || txnId,
                        recipientName: recipientUsername,
                        timestamp: transactionData?.transactionFinishTime || new Date().toLocaleString('vi-VN'),
                    });
                }, 500);
                break;

            case 'PENDING':
                showToast.info('Thông báo', 'Giao dịch đang được xử lý. Vui lòng chờ...');
                break;

            case 'FAILED':
            case 'CANCELLED':
                showToast.error('Lỗi thanh toán', transactionData?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
                break;

            default:
                if (transactionData?.code === '00') {
                    showToast.success('Thanh toán thành công', 'Chuyển khoản thành công!');
                    setTimeout(() => {
                        navigate('PaymentSuccessScreen', {
                            amount: transactionData?.amount || amount,
                            transactionId: transactionData?.transactionId || txnId,
                            recipientName: recipientUsername,
                            timestamp: transactionData?.transactionFinishTime || new Date().toLocaleString('vi-VN'),
                        });
                    }, 500);
                } else {
                    showToast.info('Kết quả giao dịch', transactionData?.message || 'Vui lòng kiểm tra lại giao dịch');
                }
        }
    };

    // =============================================
    // EFFECTS
    // =============================================

    // Fetch recipient data & login to MBLaos on mount
    useEffect(() => {
        const fetchRecipientData = async () => {
            if (!userId) return;

            setLoadingBankAccount(true);
            try {
                const [userData, bankAccount] = await Promise.all([
                    paymentService.getUserById(userId),
                    paymentService.getRecipientBankAccount(userId),
                ]);

                if (userData) setRecipientUsername(userData.username || '');
                if (bankAccount) setRecipientBankAccount(bankAccount);
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
        };

        const loginToMBLaos = async () => {
            try {
                const response = await paymentService.loginMBLaos();
                if (!response?.csrfToken) return;

                setMBLaosToken(response.csrfToken);

                const transactionId = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
                setCurrentTransactionId(transactionId);

                // Register transaction with server
                paymentService.registerTransactionWithServer(transactionId, 10000, userId);

                // Create redirect URL
                const callbackUrl = `yummy://pay?token=${encodeURIComponent(response.csrfToken)}&transactionId=${transactionId}`;
                const redirectResponse = await paymentService.createMBLaosRedirectUrl(
                    response.csrfToken,
                    {
                        transactionId,
                        phoneNumber: '02053636361',
                        clientIp: '123.123.123',
                        failUrl: callbackUrl,
                        returnUrl: callbackUrl,
                        successUrl: callbackUrl,
                        amount: 10,
                        currency: 'LAK',
                    }
                );

                if (redirectResponse?.redirectUrl) {
                    setMBLaosRedirectUrl(redirectResponse.redirectUrl);
                }
            } catch (error) {
                // Silent fail - will show error when user tries to pay
            }
        };

        fetchRecipientData();
        loginToMBLaos();
    }, [userId]);

    // Deep link listener
    useEffect(() => {
        const subscription = Linking.addEventListener('url', handleDeepLink);
        return () => subscription.remove();
    }, [handleDeepLink]);

    // Polling for transaction status
    useEffect(() => {
        if (!currentTransactionId || !mbLaosToken || !hasRedirectedToMBLaos) return;

        let currentToken = mbLaosToken;

        const checkStatus = async () => {
            try {
                let verifyResponse;

                try {
                    verifyResponse = await paymentService.verifyTransactionStatus(currentToken, currentTransactionId);
                } catch (error: any) {
                    // Auto re-login if TOKEN_EXPIRED
                    if (error.message === 'TOKEN_EXPIRED') {
                        const newToken = await refreshToken();
                        if (newToken) {
                            currentToken = newToken;
                            verifyResponse = await paymentService.verifyTransactionStatus(newToken, currentTransactionId);
                        } else {
                            return;
                        }
                    } else {
                        throw error;
                    }
                }

                const transactionData = Array.isArray(verifyResponse) ? verifyResponse[0] : verifyResponse;
                const status = transactionData?.transactionStatus || transactionData?.status;

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
                // Silent fail - will retry on next interval
            }
        };

        checkStatus();
        const intervalId = setInterval(checkStatus, 5000);

        return () => clearInterval(intervalId);
    }, [currentTransactionId, mbLaosToken, hasRedirectedToMBLaos, amount, recipientUsername]);

    // Check initial URL on focus
    useFocusEffect(
        useCallback(() => {
            const checkInitialURL = async () => {
                const initialUrl = await Linking.getInitialURL();
                if (initialUrl) {
                    handleDeepLink({ url: initialUrl });
                }
            };
            checkInitialURL();
        }, [handleDeepLink])
    );

    // =============================================
    // HANDLERS
    // =============================================
    const handleAmountChange = useCallback((text: string) => {
        const numericValue = text.replace(/[^0-9]/g, '');
        setInputAmount(numericValue);
        setAmount(numericValue ? parseInt(numericValue, 10) : 0);
    }, []);

    const handlePaymentMethodSelect = useCallback((id: string) => {
        setPaymentMethods(prev =>
            prev.map(method => ({
                ...method,
                selected: method.id === id,
            }))
        );
    }, []);

    const handleConfirmPayment = useCallback(() => {
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
    }, [amount, paymentMethods]);

    const handleProcessPayment = useCallback(async () => {
        if (!mbLaosRedirectUrl) {
            showToast.error('Thông báo', 'Không thể kết nối MBLaos. Vui lòng thử lại sau.');
            return;
        }

        try {
            await Linking.openURL(mbLaosRedirectUrl);
            setHasRedirectedToMBLaos(true);
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
    }, [mbLaosRedirectUrl]);

    // =============================================
    // RETURN
    // =============================================
    return {
        // State
        amount,
        inputAmount,
        showPaymentConfirmation,
        selectedPaymentMethod,
        recipientBankAccount,
        loadingBankAccount,
        recipientUsername,
        paymentMethods,
        mbLaosRedirectUrl,

        // Handlers
        handleAmountChange,
        handlePaymentMethodSelect,
        handleConfirmPayment,
        handleProcessPayment,
        setShowPaymentConfirmation,
        setAmount,
        setInputAmount,
    };
};
