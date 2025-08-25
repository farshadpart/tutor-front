import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const MessageItem = React.memo(({ item }: { item : any}) => {
    return (
        <View
            style={[
                styles.message,
                item.reply
                    ? !item.error
                        ? styles.replyMessage
                        : styles.errorMessage
                    : styles.receivedMessage
            ]}
        >
            <Text>{item.text}</Text>
        </View>
    );
});

MessageItem.displayName = "Message";

const styles = StyleSheet.create({
    container: { flex: 1 },
    message: {
        padding: 10,
        margin: 5,
        borderRadius: 10,
        maxWidth: '75%',
    },
    receivedMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#eee',
    },
    replyMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#DCF8C6', // WhatsApp-style green
    },
    errorMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#ffcccc', // WhatsApp-style red
    }
});