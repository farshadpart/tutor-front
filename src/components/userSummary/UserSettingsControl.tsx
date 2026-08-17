import { ThemedText } from '@/src/components/themedText/ThemedText';
import { useTheme } from '@/src/providers/ThemeProvider';
import { useUserSettingsProvider } from '@/src/providers/UserSettingsProvider';
import React from 'react';
import { StyleSheet, Switch, View } from 'react-native';

export const UserSettingsControl = () => {
    const { autoPlayVoice, isSaving, updateAutoPlayVoice } = useUserSettingsProvider();
    const { theme } = useTheme();

    return (
        <View style={styles.settingRow}>
            <ThemedText style={styles.settingLabel}>Auto-play voice</ThemedText>
            <Switch
                testID="auto-play-voice-switch"
                accessibilityLabel="Auto-play voice"
                value={autoPlayVoice}
                disabled={isSaving}
                onValueChange={(value) => void updateAutoPlayVoice(value)}
                trackColor={{
                    false: theme.colors.switchTrackInactive,
                    true: theme.colors.primary,
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 12,
        paddingHorizontal: 4,
        paddingVertical: 4,
    },
    settingLabel: {
        flex: 1,
        fontSize: 15,
    },
});
