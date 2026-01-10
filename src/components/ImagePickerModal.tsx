import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, ImagesSvg } from '@/utils';
import { IconSvg } from './IconSvg';

interface ImagePickerModalProps {
    visible: boolean;
    onClose: () => void;
    onCameraPress: () => void;
    onLibraryPress: () => void;
}

const ImagePickerModal: React.FC<ImagePickerModalProps> = ({
    visible,
    onClose,
    onCameraPress,
    onLibraryPress,
}) => {
    const { t } = useTranslation();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <View style={styles.container} onStartShouldSetResponder={() => true}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>{t('image_picker.title')}</Text>
                        <Text style={styles.subtitle}>{t('image_picker.subtitle')}</Text>
                    </View>

                    {/* Options */}
                    <View style={styles.optionsContainer}>
                        {/* Camera Option */}
                        <TouchableOpacity
                            style={styles.option}
                            onPress={() => {
                                onClose();
                                onCameraPress();
                            }}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.iconContainer, styles.cameraIconBg]}>
                                <IconSvg
                                    xml={ImagesSvg.icCamera}
                                    width={32}
                                    height={32}
                                    color={colors.dark}
                                />
                            </View>
                            <View style={styles.optionText}>
                                <Text style={styles.optionTitle}>{t('image_picker.camera')}</Text>
                                <Text style={styles.optionDescription}>
                                    {t('image_picker.camera_description')}
                                </Text>
                            </View>
                        </TouchableOpacity>

                        {/* Library Option */}
                        <TouchableOpacity
                            style={styles.option}
                            onPress={() => {
                                onClose();
                                onLibraryPress();
                            }}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.iconContainer, styles.libraryIconBg]}>
                                <IconSvg
                                    xml={ImagesSvg.icImage}
                                    width={32}
                                    height={32}
                                    color={colors.dark}
                                />
                            </View>
                            <View style={styles.optionText}>
                                <Text style={styles.optionTitle}>{t('image_picker.library')}</Text>
                                <Text style={styles.optionDescription}>
                                    {t('image_picker.library_description')}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Cancel Button */}
                    <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                        <Text style={styles.cancelText}>{t('cancel')}</Text>
                    </TouchableOpacity>
                </View>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    container: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: colors.light,
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    header: {
        marginBottom: 24,
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: colors.dark,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: colors.smallText,
        textAlign: 'center',
    },
    optionsContainer: {
        gap: 12,
        marginBottom: 20,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    cameraIconBg: {
        backgroundColor: colors.primary + '15',
    },
    libraryIconBg: {
        backgroundColor: colors.primary + '15',
    },
    optionText: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.dark,
        marginBottom: 4,
    },
    optionDescription: {
        fontSize: 13,
        color: colors.smallText,
    },
    emojiIcon: {
        fontSize: 32,
    },
    cancelButton: {
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    cancelText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.dark,
    },
});

export default ImagePickerModal;
