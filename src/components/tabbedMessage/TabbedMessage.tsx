import { TabbedMessageProps } from '@/src/components/tabbedMessage/types/TabbedMessageProps';
import { TabItem } from '@/src/components/tabbedMessage/types/TabItem';
import { TutorPartKey } from '@/src/components/tabbedMessage/types/TutorPartKey';
import { ThemedText } from '@/src/components/themedText/ThemedText';
import { ThemedTouchableOpacity } from '@/src/components/themedTouchableOpacity/ThemedTouchableOpacity';
import { ThemedView } from '@/src/components/themedView/ThemedView';
import { useTheme } from '@/src/providers/ThemeProvider';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useMemo, useState, useEffect } from 'react';
import {Pressable, StyleSheet} from 'react-native';
import { useAudioPlayerProvider } from "@/src/providers/AudioPlayerProvider";
import { useUserSettingsProvider} from "@/src/providers/UserSettingsProvider";

export function TabbedMessage({
    messageId,
    response,
    revisedSentence,
    correction,
    audioUrl,
    initialSelected,
    onSelectedChange,
    containerStyle,
}: TabbedMessageProps) {
    const { theme } = useTheme();
    const { handlePlayTap, hotMessage, setHotMessage } = useAudioPlayerProvider();
    const { autoPlayVoice } = useUserSettingsProvider();
    
    useEffect(() => {
        if(autoPlayVoice && hotMessage === messageId){
            void handlePlayTap(audioUrl);
            setHotMessage(undefined);
        }
    }, []);

    const availableTabs = useMemo(() => {
        const tabs: TabItem[] = [
            { key: 'reply', label: 'Reply', icon: 'chatbubble-ellipses-outline', value: response },
            { key: 'correction', label: 'Correction', icon: 'checkmark-circle-outline', value: correction },
            { key: 'revisedSentence', label: 'Revised Sentence', icon: 'create-outline', value: revisedSentence }
        ];

        return tabs.filter(t => (t.value ?? '').trim().length > 0);
    }, [response, revisedSentence, correction]);

    const fallbackSelected: TutorPartKey = availableTabs[0]?.key ?? 'reply';

    const [selected, setSelected] = useState<TutorPartKey>(
        initialSelected && availableTabs.some(t => t.key === initialSelected)
            ? initialSelected
            : fallbackSelected
    );

    const selectedText = useMemo(() => {
        return availableTabs.find(t => t.key === selected)?.value ?? '';
    }, [availableTabs, selected]);

    const select = (key: TutorPartKey) => {
        setSelected(key);
        onSelectedChange?.(key);
    };

    if (availableTabs.length === 0) 
        return null;

    return (
        <ThemedView style={[styles.wrapper, containerStyle]}>
            <ThemedView
                style={[
                    styles.bubble,
                    {
                        backgroundColor: theme.colors.replyMessageBackground,
                        borderColor: theme.colors.border,
                    },
                ]}
            >
                <Pressable onPress={async () => await handlePlayTap(audioUrl)}>
                    <ThemedText style={{ color: theme.colors.text }}>
                        {selectedText}
                    </ThemedText>
                </Pressable>
            </ThemedView>

            <ThemedView>
                <ThemedView style={styles.tabsInner}>
                    {availableTabs.map((t, idx) => {
                        const isActive = t.key === selected;

                        return (
                            <ThemedTouchableOpacity
                                key={t.key}
                                activeOpacity={0.7}
                                onPress={(e) => { select(t.key); e.stopPropagation?.(); }}
                                accessibilityRole="button"
                                accessibilityLabel={t.label}
                                style={[
                                    styles.tab,
                                    {
                                        backgroundColor: isActive ? theme.colors.primary : theme.colors.replyMessageBackground,
                                        borderColor: theme.colors.border,
                                    },
                                ]}
                            >
                                <Ionicons
                                    name={t.icon}
                                    size={18}
                                    color={isActive ? theme.colors.primaryText : theme.colors.textSecondary}
                                />
                            </ThemedTouchableOpacity>
                        );
                    })}
                </ThemedView>
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        maxWidth: '75%',
        alignSelf: 'flex-end',
        marginRight: 5
    },
    bubble: {
        borderRadius: 10,
        padding: 10
    },
    tab: {
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 0,
        borderBottomEndRadius: 10,
        borderBottomStartRadius: 10,
        alignSelf: 'flex-start',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabsInner: {
        flexDirection: 'row',
        alignSelf: 'flex-end',
        marginRight: 5
    }
});
