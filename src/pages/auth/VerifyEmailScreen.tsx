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
import { AuthStackParamList } from '@/navigation/types';

import { CustomButton } from '@/components';
import {
    colors,
    goBack,
    navigate,
    showToast,
} from '@/utils';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
    verifyEmailAPI,
    resendVerificationEmailAPI,
} from '@/redux/slices/auth/authThunk';
import { clearSignUpForm } from '@/redux/slices/auth/signupSlice';
import { useLoading } from '@/hooks/useLoading';


interface VerifyEmailScreenProps
    extends NativeStackScreenProps<AuthStackParamList, 'VerifyEmailScreen'> { }

const VerifyEmailScreen: React.FC<VerifyEmailScreenProps> = ({ route }) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { LoadingShow, LoadingHide } = useLoading();
    const signupFormData = useAppSelector(state => state.signup.formData);
    const { email, flowType = 'signup' } = route.params || {}; // ← Detect flow type

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
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
            setError(t('verification_screen.error_full_code'));
            return;
        }

        // ← Check flow type
        if (flowType === 'signup' && !signupFormData) {
            setError(t('verification_screen.error_form_data'));
            return;
        }

        setError('');
        LoadingShow();

        try {
            if (flowType === 'signup') {
                // ✅ SIGNUP FLOW: Verify email + create user
                const resultAction = await dispatch(
                    verifyEmailAPI({
                        email,
                        verificationCode,
                        userData: signupFormData || undefined // ← Convert null to undefined
                    })
                );

                if (!verifyEmailAPI.fulfilled.match(resultAction)) {
                    throw new Error(t('verification_screen.error_verification_failed'));
                }

                const user = resultAction.payload;
                if (!user) {
                    throw new Error(t('verification_screen.error_verification_failed'));
                }

                // ✅ Email verified, xóa form data từ Redux
                dispatch(clearSignUpForm());
                navigate('LoginScreen');
                showToast.success(t('signup_screen.signup_register_success_toast'));
            } else if (flowType === 'forgotPassword') {
                // ✅ FORGOT PASSWORD FLOW: Verify code first before going to reset password
                // Call API to verify the code is correct
                const resultAction = await dispatch(
                    verifyEmailAPI({
                        email,
                        verificationCode,
                    })
                );

                if (!verifyEmailAPI.fulfilled.match(resultAction)) {
                    throw new Error(t('verification_screen.error_verification_failed'));
                }

                // Code is verified, navigate to reset password screen
                navigate('ResetPasswordPage', { email, verificationCode });
                showToast.success(t('verification_screen.code_verified'));
            }
        } catch (error: any) {
            const errorMsg = error?.message || 'Verification failed';
            setError(errorMsg);
            showToast.error(flowType === 'signup' ? t('signup_screen.signup_register_error_toast') : 'Verification failed');
        } finally {
            LoadingHide();
        }
    };

    const handleResendCode = async () => {
        if (!canResend) return;

        LoadingShow();
        setError('');

        try {
            const resultAction = await dispatch(
                resendVerificationEmailAPI({ email })
            );

            if (!resendVerificationEmailAPI.fulfilled.match(resultAction)) {
                throw new Error('Resend failed');
            }

            // Reset timer
            setTimeLeft(900);
            setCanResend(false);
            setOtp(['', '', '', '', '', '']);
        } catch (error: any) {
            const errorMsg = error?.message || 'Failed to resend verification code';
            setError(errorMsg);
        } finally {
            LoadingHide();
        }
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
                        <Text style={styles.backButtonText}>{t('verification_screen.back_button')}</Text>
                    </TouchableOpacity>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>{t('verification_screen.title')}</Text>
                        <Text style={styles.subtitle}>
                            {t('verification_screen.subtitle')}
                        </Text>
                        <Text style={styles.email}>{email}</Text>
                    </View>

                    {/* Content */}
                    <View style={styles.body}>
                        <Text style={styles.instructions}>
                            {t('verification_screen.instructions')}
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
                                />
                            ))}
                        </View>

                        {error ? <Text style={styles.errorMessage}>{error}</Text> : null}

                        {/* Timer */}
                        <View style={styles.timerContainer}>
                            <Text style={styles.timerLabel}>{t('verification_screen.timer_label')}</Text>
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
                            title={t('verification_screen.verify_button')}
                            onPress={handleVerifyEmail}
                            disabled={otp.join('').length !== 6}
                        />

                        {/* Resend Section */}
                        <View style={styles.resendContainer}>
                            <Text style={styles.resendText}>{t('verification_screen.resend_label')}</Text>
                            <TouchableOpacity
                                onPress={handleResendCode}
                                disabled={!canResend}
                            >
                                <Text
                                    style={[
                                        styles.resendButton,
                                        !canResend && styles.resendButtonDisabled,
                                    ]}
                                >
                                    {t('verification_screen.resend_button')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            {t('verification_screen.support_text')}{' '}
                            <Text style={styles.contactLink}>{t('verification_screen.support_link')}</Text>
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
