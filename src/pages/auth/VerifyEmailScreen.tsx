import React, { useState, useEffect, useRef } from 'react';
import {
    Keyboard,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    TextInput,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../android/types/StackNavType';

import { CustomButton } from '@/components';
import {
    colors,
    goBack,
    handleAsyncAction,
    navigate,
} from '@/utils';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
    verifyEmailAPI,
    resendVerificationEmailAPI,
} from '@/redux/slices/auth/authThunk';
import { clearSignUpForm } from '@/redux/slices/auth/signupSlice';


interface VerifyEmailScreenProps
    extends NativeStackScreenProps<RootStackParamList, 'VerifyEmailScreen'> { }

const VerifyEmailScreen: React.FC<VerifyEmailScreenProps> = ({ route }) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const signupFormData = useAppSelector(state => state.signup.formData);
    const { email } = route.params || {};

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef<TextInput[]>([]);

    // Countdown timer
    useEffect(() => {
        if (timeLeft <= 0) {
            setCanResend(true);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleOtpChange = (index: number, value: string) => {
        // Only allow digits
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError('');

        // Auto move to next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (index: number, key: string) => {
        // Handle backspace
        if (key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerifyEmail = async () => {
        const verificationCode = otp.join('');

        // Validate
        if (verificationCode.length !== 6) {
            setError('Vui lòng nhập đầy đủ 6 chữ số');
            return;
        }

        if (!signupFormData) {
            setError('Dữ liệu form không tồn tại. Vui lòng đăng ký lại.');
            return;
        }

        setError('');
        setIsLoading(true);

        await handleAsyncAction(
            async () => {
                // ✅ Gửi form data cùng với email và code
                const resultAction = await dispatch(
                    verifyEmailAPI({ 
                        email, 
                        verificationCode,
                        userData: signupFormData // ← Gửi form data từ Redux
                    })
                );

                if (!verifyEmailAPI.fulfilled.match(resultAction)) {
                    throw new Error('Verification failed');
                }

                const user = resultAction.payload;
                if (!user) {
                    throw new Error('Failed to verify email');
                }

                // ✅ Email verified, xóa form data từ Redux
                dispatch(clearSignUpForm());
            },
            {
                successMessage: t('login_screen.email_verified_success'),
                errorMessage: 'Verification failed',
                onSuccess: () => navigate('LoginScreen'),
            }
        );

        setIsLoading(false);
    };

    const handleResendCode = async () => {
        if (!canResend) return;

        setIsLoading(true);
        setError('');

        await handleAsyncAction(
            async () => {
                const resultAction = await dispatch(
                    resendVerificationEmailAPI({ email })
                );

                if (!resendVerificationEmailAPI.fulfilled.match(resultAction)) {
                    throw new Error('Resend failed');
                }
            },
            {
                successMessage: 'Mã xác nhận đã được gửi lại. Vui lòng kiểm tra email.',
                errorMessage: 'Failed to resend verification code',
                showSuccessToast: true,
            }
        );

        // Reset timer
        setTimeLeft(900);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        setIsLoading(false);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.container}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                >
                    <TouchableOpacity
                        onPress={() => goBack()}
                        style={styles.backButton}
                    >
                        <Text style={styles.backButtonText}>← Quay lại</Text>
                    </TouchableOpacity>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Xác nhận Email</Text>
                        <Text style={styles.subtitle}>
                            Chúng tôi đã gửi mã xác nhận đến
                        </Text>
                        <Text style={styles.email}>{email}</Text>
                    </View>

                    {/* Content */}
                    <View style={styles.body}>
                        <Text style={styles.instructions}>
                            Nhập mã 6 chữ số bạn nhận được
                        </Text>

                        {/* OTP Input */}
                        <View style={styles.otpContainer}>
                            {otp.map((digit, index) => (
                                <TextInput
                                    key={index}
                                    ref={(ref) => {
                                        if (ref) inputRefs.current[index] = ref;
                                    }}
                                    style={styles.otpInput}
                                    value={digit}
                                    onChangeText={(value) => handleOtpChange(index, value)}
                                    onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
                                    placeholder="-"
                                    placeholderTextColor="#CCCCCC"
                                    keyboardType="numeric"
                                    maxLength={1}
                                    editable={!isLoading}
                                />
                            ))}
                        </View>

                        {error ? <Text style={styles.errorMessage}>{error}</Text> : null}

                        {/* Timer */}
                        <View style={styles.timerContainer}>
                            <Text style={styles.timerLabel}>Mã hết hạn trong:</Text>
                            <Text
                                style={[
                                    styles.timer,
                                    timeLeft < 300 && styles.timerWarning,
                                ]}
                            >
                                {formatTime(timeLeft)}
                            </Text>
                        </View>

                        {/* Verify Button */}
                        <CustomButton
                            title="Xác nhận"
                            onPress={handleVerifyEmail}
                            disabled={isLoading || otp.join('').length !== 6}
                        />

                        {/* Resend Section */}
                        <View style={styles.resendContainer}>
                            <Text style={styles.resendText}>Không nhận được mã?</Text>
                            <TouchableOpacity
                                onPress={handleResendCode}
                                disabled={!canResend || isLoading}
                            >
                                <Text
                                    style={[
                                        styles.resendButton,
                                        !canResend && styles.resendButtonDisabled,
                                    ]}
                                >
                                    Gửi lại
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            Có vấn đề?{' '}
                            <Text style={styles.contactLink}>Liên hệ hỗ trợ</Text>
                        </Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.light,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 20,
        alignItems: 'center',
    },
    backButton: {
        padding: 14
    },
    backButtonText: {
        fontSize: 18,
        color: colors.primary,
        fontWeight: '600',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.dark,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 15,
        color: colors.primaryText,
        marginBottom: 8,
    },
    email: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.primary,
    },
    body: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
    },
    instructions: {
        fontSize: 15,
        color: colors.primaryText,
        textAlign: 'center',
        marginBottom: 10,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        marginVertical: 20,
    },
    otpInput: {
        width: 50,
        height: 60,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: colors.white,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: colors.primary,
        color: colors.dark,
    },
    errorMessage: {
        color: colors.danger,
        fontSize: 13,
        textAlign: 'center',
    },
    timerContainer: {
        alignItems: 'center',
        paddingVertical: 16,
    },
    timerLabel: {
        fontSize: 13,
        color: colors.smallText,
        marginBottom: 4,
    },
    timer: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.primary,
    },
    timerWarning: {
        color: colors.danger,
    },
    resendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginTop: 16,
    },
    resendText: {
        fontSize: 14,
        color: colors.primaryText,
    },
    resendButton: {
        fontSize: 14,
        color: colors.dark,
        fontWeight: '600',
    },
    resendButtonDisabled: {
        fontSize: 15,
        color: colors.primary,
        fontWeight: 'bold',
    },
    resendHint: {
        fontSize: 14,
        color: colors.primaryText,
        textAlign: 'center',
    },
    footer: {
        paddingHorizontal: 20,
        paddingBottom: 30,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 14,
        color: colors.smallText,
    },
    contactLink: {
        fontSize: 14,
        color: colors.primary,
        fontWeight: '600',
    },
});

export default VerifyEmailScreen;
