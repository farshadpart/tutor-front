import { render } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import { MessageItem } from './MessageItem';

jest.mock('@/src/providers/ThemeProvider', () => ({
    useTheme: () => ({
        theme: {
            colors: {
                background: '#ffffff',
                errorMessageBackground: '#fee2e2',
                messageBackground: '#e0f2fe',
                replyMessageBackground: '#f3f4f6',
                text: '#111827',
            },
        },
    }),
}));

describe('MessageItem', () => {
    it('renders a received message with received styling', async () => {
        const { getByText } = await render(
            <MessageItem item={{ id: 'message-1', text: 'Hello tutor', reply: false }} />
        );

        const text = getByText('Hello tutor');
        const messageStyle = StyleSheet.flatten(text.parent?.props.style);

        expect(text.props.style).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ color: '#111827' }),
            ])
        );
        expect(messageStyle).toEqual(
            expect.objectContaining({
                alignSelf: 'flex-start',
                backgroundColor: '#e0f2fe',
                borderRadius: 10,
                margin: 5,
                maxWidth: '75%',
                padding: 10,
            })
        );
    });

    it('renders a reply message with reply styling', async () => {
        const { getByText } = await render(
            <MessageItem item={{ id: 'message-2', text: 'Tutor reply', reply: true }} />
        );

        const messageStyle = StyleSheet.flatten(getByText('Tutor reply').parent?.props.style);

        expect(messageStyle).toEqual(
            expect.objectContaining({
                alignSelf: 'flex-end',
                backgroundColor: '#f3f4f6',
            })
        );
    });

    it('renders an errored reply with error styling', async () => {
        const { getByText } = await render(
            <MessageItem
                item={{
                    id: 'message-3',
                    error: true,
                    reply: true,
                    text: 'Message failed',
                }}
            />
        );

        const messageStyle = StyleSheet.flatten(getByText('Message failed').parent?.props.style);

        expect(messageStyle).toEqual(
            expect.objectContaining({
                alignSelf: 'flex-end',
                backgroundColor: '#fee2e2',
            })
        );
    });
});
