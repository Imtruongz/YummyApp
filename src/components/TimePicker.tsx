import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, ImagesSvg } from '@/utils';
import { IconSvg } from '@/components';

interface TimePickerProps {
    value: number; // Tổng số phút
    onChange: (minutes: number) => void;
    label?: string;
    minuteInterval?: 5 | 15 | 30; // Khoảng cách giữa các phút
}

const TimePicker: React.FC<TimePickerProps> = ({
    value,
    onChange,
    label,
    minuteInterval = 15
}) => {
    const { t } = useTranslation();
    const [isPickerVisible, setIsPickerVisible] = useState(false);
    const [selectedHours, setSelectedHours] = useState(Math.floor((value || 0) / 60));
    const [selectedMinutes, setSelectedMinutes] = useState((value || 0) % 60);

    // Generate hours (0-8 giờ, tối đa 8 giờ nấu)
    const hours = Array.from({ length: 9 }, (_, i) => i);

    // Generate minutes based on interval
    const minutes = Array.from({ length: 60 / minuteInterval }, (_, i) => i * minuteInterval);

    const formatTime = (totalMinutes: number): string => {
        if (totalMinutes === 0) return t('time_picker.not_selected');
        const h = Math.floor(totalMinutes / 60);
        const m = totalMinutes % 60;

        if (h === 0) return `${m} ${t('time_picker.minutes')}`;
        if (m === 0) return `${h} ${t('time_picker.hours')}`;
        return `${h} ${t('time_picker.hours')} ${m} ${t('time_picker.minutes')}`;
    };

    const handleConfirm = () => {
        const totalMinutes = selectedHours * 60 + selectedMinutes;
        onChange(totalMinutes);
        setIsPickerVisible(false);
    };

    const handleCancel = () => {
        // Reset về giá trị cũ
        setSelectedHours(Math.floor((value || 0) / 60));
        setSelectedMinutes((value || 0) % 60);
        setIsPickerVisible(false);
    };

    return (
        <View>
            {<Text style={styles.label}>{label || t('time_picker.cooking_time')}</Text>}

            {/* Display Button */}
            <TouchableOpacity
                style={styles.displayButton}
                onPress={() => setIsPickerVisible(true)}
            >
                <View style={styles.displayContent}>
                    <Text style={styles.displayText}>{formatTime(value || 0)}</Text>
                </View>
                <IconSvg
                    xml={ImagesSvg.iconArrowDown}
                    width={16}
                    height={16}
                    color={colors.primary}
                />
            </TouchableOpacity>

            {/* Picker Modal */}
            <Modal
                visible={isPickerVisible}
                transparent
                animationType="slide"
                onRequestClose={handleCancel}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {/* Header */}
                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={handleCancel}>
                                <Text style={styles.cancelButton}>{t('time_picker.cancel')}</Text>
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>{label || t('time_picker.cooking_time')}</Text>
                            <TouchableOpacity onPress={handleConfirm}>
                                <Text style={styles.confirmButton}>{t('time_picker.done')}</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Picker */}
                        <View style={styles.pickerContainer}>
                            {/* Hours Picker */}
                            <View style={styles.pickerColumn}>
                                <Text style={styles.columnLabel}>{t('time_picker.hours_label')}</Text>
                                <ScrollView
                                    style={styles.scrollPicker}
                                    showsVerticalScrollIndicator={false}
                                >
                                    {hours.map((hour) => (
                                        <TouchableOpacity
                                            key={`hour-${hour}`}
                                            style={[
                                                styles.pickerItem,
                                                selectedHours === hour && styles.pickerItemSelected
                                            ]}
                                            onPress={() => setSelectedHours(hour)}
                                        >
                                            <Text
                                                style={[
                                                    styles.pickerItemText,
                                                    selectedHours === hour && styles.pickerItemTextSelected
                                                ]}
                                            >
                                                {hour}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>

                            {/* Separator */}
                            <Text style={styles.separator}>:</Text>

                            {/* Minutes Picker */}
                            <View style={styles.pickerColumn}>
                                <Text style={styles.columnLabel}>{t('time_picker.minutes_label')}</Text>
                                <ScrollView
                                    style={styles.scrollPicker}
                                    showsVerticalScrollIndicator={false}
                                >
                                    {minutes.map((minute) => (
                                        <TouchableOpacity
                                            key={`minute-${minute}`}
                                            style={[
                                                styles.pickerItem,
                                                selectedMinutes === minute && styles.pickerItemSelected
                                            ]}
                                            onPress={() => setSelectedMinutes(minute)}
                                        >
                                            <Text
                                                style={[
                                                    styles.pickerItemText,
                                                    selectedMinutes === minute && styles.pickerItemTextSelected
                                                ]}
                                            >
                                                {minute.toString().padStart(2, '0')}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        </View>

                        {/* Preview */}
                        <View style={styles.previewContainer}>
                            <Text style={styles.previewLabel}>{t('time_picker.selected_time')}:</Text>
                            <Text style={styles.previewValue}>
                                {formatTime(selectedHours * 60 + selectedMinutes)}
                            </Text>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.dark,
        marginBottom: 16,
    },
    displayButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.InputBg,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        paddingHorizontal: 14,
        height: 44,
    },
    displayContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    iconText: {
        fontSize: 20,
    },
    displayText: {
        fontSize: 15,
        fontWeight: '500',
        color: colors.dark,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.light,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingBottom: 40,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.dark,
    },
    cancelButton: {
        fontSize: 16,
        color: colors.smallText,
        fontWeight: '500',
    },
    confirmButton: {
        fontSize: 16,
        color: colors.primary,
        fontWeight: '600',
    },
    pickerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 40,
        height: 280,
    },
    pickerColumn: {
        flex: 1,
        alignItems: 'center',
    },
    columnLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.smallText,
        marginBottom: 12,
    },
    scrollPicker: {
        maxHeight: 200,
        width: '100%',
    },
    separator: {
        fontSize: 32,
        fontWeight: '700',
        color: colors.primary,
        marginHorizontal: 16,
        marginTop: 20,
    },
    pickerItem: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderRadius: 12,
        marginVertical: 4,
    },
    pickerItemSelected: {
        backgroundColor: colors.primary,
    },
    pickerItemText: {
        fontSize: 24,
        fontWeight: '600',
        color: colors.dark,
    },
    pickerItemTextSelected: {
        color: colors.light,
    },
    previewContainer: {
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: colors.primary + '10',
        marginHorizontal: 20,
        borderRadius: 12,
    },
    previewLabel: {
        fontSize: 13,
        color: colors.smallText,
        marginBottom: 4,
    },
    previewValue: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.primary,
    },
});

export default TimePicker;
