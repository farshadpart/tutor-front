import React from 'react';
import { Modal, StyleSheet, View, Pressable } from 'react-native';
import { useTheme } from '@/src/providers/ThemeProvider';

type ThemedModalProps = {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
};

export const ThemedModal = ({
    visible,
    onClose,
    children,
}: ThemedModalProps) => {
    const { theme, scheme } = useTheme();

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View
                style={[
                    styles.overlay,
                    { backgroundColor: theme.colors.modalOverlay },
                ]}
            >
                <Pressable style={styles.backdrop} onPress={onClose} />

                <View
                    style={[
                        styles.container,
                        {
                            backgroundColor: theme.colors.modalBackground,
                            shadowColor: theme.colors.modalShadowColor,
                            shadowOpacity: scheme === 'dark' ? 0.6 : 0.25,
                            shadowRadius: scheme === 'dark' ? 16 : 8,
                        },
                    ]}
                >
                    {children}
                </View>
            </View>
        </Modal>
    );
};


const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    container: {
        width: '85%',
        maxWidth: 420,
        borderRadius: 14,
        padding: 20,

        shadowOffset: { width: 0, height: 8 },
        elevation: 12,
    },
});
