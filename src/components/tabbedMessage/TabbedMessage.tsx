import { ThemedText } from '@/src/components/themedText/ThemedText';
import { ThemedTouchableOpacity } from '@/src/components/themedTouchableOpacity/ThemedTouchableOpacity';
import { ThemedView } from '@/src/components/themedView/ThemedView';
import React, { useMemo, useState } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/src/providers/ThemeProvider';

type TutorPartKey = 'reply' | 'revisedSentence' | 'correction';

type TabbedMessageProps = {
    response?: string;
    revisedSentence?: string;
    correction?: string;
    initialSelected?: TutorPartKey;
    onSelectedChange?: (key: TutorPartKey) => void;
    containerStyle?: ViewStyle;
};

type TabItem = {
    key: TutorPartKey;
    label: string;
    value?: string;
};

export function TabbedMessage({
    response,
    revisedSentence,
    correction,
    initialSelected,
    onSelectedChange,
    containerStyle,
}: TabbedMessageProps) {
    const { theme } = useTheme();

    const availableTabs = useMemo(() => {
        const tabs: TabItem[] = [
            { key: 'reply', label: 'Reply', value: response },
            { key: 'revisedSentence', label: 'Revised Sentence', value: revisedSentence },
            { key: 'correction', label: 'Correction', value: correction },
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

    if (availableTabs.length === 0) return null;

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
                <ThemedText style={{ color: theme.colors.text }}>
                    {selectedText}
                </ThemedText>
            </ThemedView>

            <ThemedView>
                <ThemedView style={styles.tabsInner}>
                    {availableTabs.map((t, idx) => {
                        const isActive = t.key === selected;

                        return (
                            <ThemedTouchableOpacity
                                key={t.key}
                                activeOpacity={0.7}
                                onPress={() => select(t.key)}
                                style={[
                                    styles.tab,
                                    {
                                        backgroundColor: isActive ? theme.colors.primary : theme.colors.secondary,
                                        borderColor: theme.colors.border,
                                    },
                                ]}
                            >
                                <ThemedText style={isActive ? { color: theme.colors.primaryText } : { color: theme.colors.textSecondary }}>
                                    {t.label}
                                </ThemedText>
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
        borderWidth: 1,
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
        minHeight: 90,
    },
    tab: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderWidth: 1,
        borderTopWidth: 0,

        flexGrow: 0,
        flexShrink: 0,
        alignSelf: 'flex-start',
    },
    tabsInner: {
        flexDirection: 'row',
        alignSelf: 'flex-end',
    }
});
