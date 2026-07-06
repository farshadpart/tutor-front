import { fireEvent, render } from '@testing-library/react-native';
import { TouchableOpacity as MockTouchableOpacity } from 'react-native';
import { ActConfirm } from './ActConfirm';

jest.mock('@/src/providers/ThemeProvider', () => ({
    useTheme: () => ({
        theme: {
            colors: {
                destructive: '#dc2626',
                destructiveBackground: '#fee2e2',
                primary: '#3b82f6',
                secondary: '#e5e7eb',
                text: '#111827',
            },
        },
    }),
}));

jest.mock('@/src/components/themedTouchableOpacity/ThemedTouchableOpacity', () => ({
    ThemedTouchableOpacity: ({ children, onPress, style }: any) => {
        const label = children?.props?.children;

        return (
            <MockTouchableOpacity onPress={onPress} style={style} testID={`act-confirm-${label}`}>
                {children}
            </MockTouchableOpacity>
        );
    },
}));

describe('ActConfirm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the title, message, and default submit label', async () => {
        const { getByText, queryByText } = await render(
            <ActConfirm
                title="Delete lesson"
                message="This cannot be undone."
                onAct={jest.fn()}
            />
        );

        expect(getByText('Delete lesson')).toBeTruthy();
        expect(getByText('This cannot be undone.')).toBeTruthy();
        expect(getByText('Ok')).toBeTruthy();
        expect(queryByText('Cancel')).toBeNull();
    });

    it('calls the submit handler when the submit action is pressed', async () => {
        const onAct = jest.fn();
        const { getByText } = await render(
            <ActConfirm
                title="Reset password"
                message="Password reset complete."
                onAct={onAct}
            />
        );

        await fireEvent.press(getByText('Ok'));

        expect(onAct).toHaveBeenCalledTimes(1);
    });

    it('renders and calls the optional cancel action', async () => {
        const onAct = jest.fn();
        const onCancel = jest.fn();
        const { getByText } = await render(
            <ActConfirm
                title="Leave checkout"
                message="Your progress will be lost."
                submitLabel="Leave"
                onAct={onAct}
                onCancel={onCancel}
            />
        );

        await fireEvent.press(getByText('Cancel'));
        await fireEvent.press(getByText('Leave'));

        expect(onCancel).toHaveBeenCalledTimes(1);
        expect(onAct).toHaveBeenCalledTimes(1);
    });

    it('uses destructive styling for dangerous actions', async () => {
        const { getByTestId, getByText } = await render(
            <ActConfirm
                dangerousAct
                title="Delete chat"
                message="Delete this chat permanently?"
                submitLabel="Delete"
                onAct={jest.fn()}
                onCancel={jest.fn()}
            />
        );

        expect(getByTestId('act-confirm-Cancel').props.style).toEqual(
            expect.objectContaining({
                backgroundColor: '#e5e7eb',
                padding: 6,
            })
        );
        expect(getByTestId('act-confirm-Delete').props.style).toEqual(
            expect.objectContaining({
                backgroundColor: '#fee2e2',
                padding: 6,
            })
        );
        expect(getByText('Delete').props.style).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    color: '#dc2626',
                }),
            ])
        );
    });
});
