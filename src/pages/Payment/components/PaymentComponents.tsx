import React from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { PaymentMethod, BankAccount } from '../type';
import { IconSvg } from '@/components';
import { colors, ImagesSvg, BIDVLogo, MBLogo, ZaloPayLogo } from '@/utils';

// =============================================
// RECIPIENT CARD
// =============================================
interface RecipientCardProps {
    accountName?: string;
}

export const RecipientCard: React.FC<RecipientCardProps> = ({ accountName }) => {
    const { t } = useTranslation();

    return (
        <View style={styles.paymentCard}>
            <View style={styles.serviceIconContainer}>
                <IconSvg xml={ImagesSvg.icHeart} width={30} height={30} color={colors.primary} />
            </View>
            <Text style={styles.serviceTitle}>{t('payment_screen.payment_title')}</Text>
            <Text style={styles.phoneNumber}>{accountName}</Text>
        </View>
    );
};

// =============================================
// AMOUNT INPUT CARD
// =============================================
interface AmountInputCardProps {
    inputAmount: string;
    onAmountChange: (text: string) => void;
    onQuickAmountSelect: (amount: number, inputAmount: string) => void;
}

export const AmountInputCard: React.FC<AmountInputCardProps> = ({
    inputAmount,
    onAmountChange,
    onQuickAmountSelect,
}) => {
    const { t } = useTranslation();

    const quickAmounts = [
        { amount: 5, label: '$5' },
        { amount: 10, label: '$10' },
        { amount: 20, label: '$20' },
    ];

    return (
        <View style={styles.donationCard}>
            <View style={styles.donationTitleRow}>
                <Text style={styles.donationTitle}>{t('payment_screen.payment_amount')}</Text>
            </View>

            <View style={styles.amountInputContainer}>
                <Text style={styles.currencyLabel}>$</Text>
                <TextInput
                    style={styles.amountInput}
                    value={inputAmount}
                    onChangeText={onAmountChange}
                    keyboardType="numeric"
                    placeholder={t('payment_screen.payment_enter_amount')}
                    placeholderTextColor="#aaa"
                />
            </View>

            <View style={styles.quickAmountContainer}>
                {quickAmounts.map(({ amount, label }) => (
                    <TouchableOpacity
                        key={amount}
                        style={styles.quickAmountButton}
                        onPress={() => onQuickAmountSelect(amount, amount.toString())}
                    >
                        <Text style={styles.quickAmountText}>{label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

// =============================================
// PAYMENT METHODS LIST
// =============================================
interface PaymentMethodsListProps {
    methods: PaymentMethod[];
    onSelect: (id: string) => void;
}

export const PaymentMethodsList: React.FC<PaymentMethodsListProps> = ({ methods, onSelect }) => {
    const { t } = useTranslation();

    const renderIcon = (method: PaymentMethod) => {
        const iconStyle = { width: 30, height: 30, resizeMode: 'contain' as const };

        if (method.iconType === 'image' && method.imagePath) {
            return <Image source={method.imagePath} style={iconStyle} />;
        }

        if (method.iconType === 'custom') {
            const logoMap: Record<string, any> = {
                zalopay: ZaloPayLogo,
                bidv: BIDVLogo,
                mblaos: MBLogo,
            };
            const logo = logoMap[method.id];
            return logo ? <Image source={logo} style={iconStyle} /> : null;
        }

        return null;
    };

    return (
        <View style={styles.paymentMethodsSection}>
            <View style={styles.paymentMethodsHeader}>
                <Text style={styles.paymentMethodsTitle}>{t('payment_screen.payment_payment_methods')}</Text>
                <TouchableOpacity>
                    <Text style={styles.viewAllText}>{t('payment_screen.payment_view_all')}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.paymentMethodsList}>
                {methods.map(method => (
                    <TouchableOpacity
                        key={method.id}
                        style={[styles.paymentMethodCard, method.selected && styles.paymentMethodCardSelected]}
                        onPress={() => onSelect(method.id)}
                    >
                        <View style={styles.paymentMethodContent}>
                            {renderIcon(method)}
                            <Text style={styles.paymentMethodName}>{method.name}</Text>
                            {method.balance && <Text style={styles.paymentMethodBalance}>{method.balance}</Text>}
                            {!method.integrated && (
                                <View style={styles.notIntegratedBadge}>
                                    <Text style={styles.notIntegratedText}>{t('demo')}</Text>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

// =============================================
// BANK INFO CARD
// =============================================
interface BankInfoCardProps {
    recipientUsername: string;
    bankAccount: BankAccount | null;
}

export const BankInfoCard: React.FC<BankInfoCardProps> = ({ recipientUsername, bankAccount }) => {
    const { t } = useTranslation();

    const InfoRow = ({ label, value }: { label: string; value?: string }) => (
        <View style={styles.bankInfoRow}>
            <Text style={styles.bankInfoLabel}>{label}</Text>
            <Text style={styles.bankInfoValue}>{value}</Text>
        </View>
    );

    return (
        <View style={styles.bankInfoCard}>
            <Text style={styles.recipientName}>{recipientUsername}</Text>
            <InfoRow label={t('bank_screen.bank_name')} value={bankAccount?.bankName} />
            <InfoRow label={t('bank_screen.bank_code')} value={bankAccount?.bankCode} />
            <InfoRow label={t('bank_screen.account_number')} value={bankAccount?.accountNumber} />
            <InfoRow label={t('bank_screen.account_name')} value={bankAccount?.accountName} />

            <View style={styles.bankInfoRow}>
                <Text style={styles.bankInfoLabel}>{t('payment_screen.transfer_note')}:</Text>
                <View style={styles.transferInputContainer}>
                    <TextInput
                        style={styles.transferNoteInput}
                        placeholder={t('payment_screen.enter_transfer_note')}
                        placeholderTextColor="#aaa"
                        defaultValue={`Donate cho ${recipientUsername}`}
                        multiline={false}
                    />
                    <IconSvg xml={ImagesSvg.icEdit} width={16} height={16} color={colors.primary} />
                </View>
            </View>
        </View>
    );
};

// =============================================
// BOTTOM PAYMENT SECTION
// =============================================
interface BottomPaymentSectionProps {
    formattedAmount: string;
    onConfirm: () => void;
}

export const BottomPaymentSection: React.FC<BottomPaymentSectionProps> = ({
    formattedAmount,
    onConfirm,
}) => {
    const { t } = useTranslation();
    const { CustomButton } = require('@/components');

    return (
        <View style={styles.bottomPaymentSection}>
            <View style={styles.totalAmount}>
                <Text style={styles.totalAmountText}>{formattedAmount}</Text>
            </View>
            <CustomButton
                title={t('confirm')}
                onPress={onConfirm}
                style={styles.confirmButton}
                fontSize={18}
            />
        </View>
    );
};

// =============================================
// STYLES
// =============================================
export const styles = StyleSheet.create({
    // Container
    container: {
        flex: 1,
        backgroundColor: '#f5f6fa',
    },

    // Payment Card (Recipient Info)
    paymentCard: {
        backgroundColor: colors.light,
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 12,
        padding: 16,
        elevation: 4,
        shadowColor: colors.dark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        alignItems: 'center',
    },
    serviceIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.primary + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
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

    // Donation Card (Amount Input)
    donationCard: {
        backgroundColor: colors.light,
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 12,
        padding: 16,
        elevation: 4,
        shadowColor: colors.dark,
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

    // Quick Amount Buttons
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

    // Payment Methods
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
        maxWidth: 90,
    },
    paymentMethodBalance: {
        position: 'absolute',
        bottom: -15,
        left: 38,
        fontSize: 13,
        color: '#64748b',
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
        zIndex: 5,
    },
    notIntegratedText: {
        fontSize: 10,
        color: '#888',
        fontWeight: '500',
    },

    // Bank Info Card
    bankInfoCard: {
        backgroundColor: colors.light,
        borderRadius: 8,
        marginVertical: 16,
        marginHorizontal: 16,
        padding: 12,
        shadowColor: colors.dark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    recipientName: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.primary,
        marginBottom: 12,
    },
    bankInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    bankInfoLabel: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
        flex: 1,
    },
    bankInfoValue: {
        fontSize: 14,
        color: '#333',
        fontWeight: '600',
        flex: 2,
        textAlign: 'right',
    },
    transferInputContainer: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        borderBottomWidth: 1,
        borderBottomColor: colors.InputBg,
    },
    transferNoteInput: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
        flex: 1,
        textAlign: 'right',
        padding: 0,
        marginRight: 5,
    },

    // Bottom Payment Section
    bottomPaymentSection: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 16,
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
        width: '60%',
        paddingHorizontal: 24,
        borderRadius: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
