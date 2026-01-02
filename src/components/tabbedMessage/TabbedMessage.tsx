import React, { useMemo, useState } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { ThemedView } from '@/src/components/themedView/ThemedView';
import { ThemedText } from '@/src/components/themedText/ThemedText';
import { useTheme } from '@/src/providers/ThemeProvider';

export type TabbedMessageProps = {
    item: {
        response: string;
        correction?: string | null;
        revisedSentence?: string | null;
        reply?: boolean;
        error?: boolean;
    }
};

export const TabbedMessage = React.memo(({ item }: TabbedMessageProps) => {
    const { theme } = useTheme();
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);

    const routes = useMemo(() => {
        const tabs: { key: string; title: string }[] = [
            { key: 'response', title: 'Reply' }
        ];

        if (item.revisedSentence)
            tabs.push({ key: 'revised', title: 'Revised Sentence' });

        if (item.correction)
            tabs.push({ key: 'correction', title: 'Correction' });

        return tabs;
    }, [item]);

    const renderScene = ({ route }: any) => {
        let text = item.response;

        if (route.key === 'revised')
            text = item.revisedSentence ?? '';

        if (route.key === 'correction')
            text = item.correction ?? '';

        return (
            <ThemedView style={styles.content}>
                <ThemedText style={{ color: theme.colors.text }}>
                    {text}
                </ThemedText>
            </ThemedView>
        );
    };

    let backgroundColor: string;
    if (item.reply) {
        backgroundColor = !item.error
            ? theme.colors.replyMessageBackground
            : theme.colors.errorMessageBackground;
    } else {
        backgroundColor = theme.colors.messageBackground;
    }

    return (
        <ThemedView
            style={[
                styles.container,
                { backgroundColor },
                item.reply ? styles.replyMessage : styles.receivedMessage
            ]}
        >
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
                swipeEnabled={false}
                renderTabBar={(props) => (
                    <TabBar
                        {...props}
                        style={[
                            styles.tabBar,
                            { backgroundColor }
                        ]}
                        indicatorStyle={{
                            backgroundColor: theme.colors.primary
                        }}
                    />
                )}
            />
        </ThemedView>
    );
});

TabbedMessage.displayName = 'TabbedMessage';

const styles = StyleSheet.create({
    container: {
        margin: 5,
        borderRadius: 10,
        maxWidth: '75%',
        overflow: 'hidden'
    },
    content: {
        padding: 10
    },
    tabBar: {
        elevation: 0,
        borderTopWidth: StyleSheet.hairlineWidth
    },
    receivedMessage: {
        alignSelf: 'flex-start'
    },
    replyMessage: {
        alignSelf: 'flex-end'
    }
});
