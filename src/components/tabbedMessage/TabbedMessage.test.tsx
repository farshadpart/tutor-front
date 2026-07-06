import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { TouchableOpacity as MockTouchableOpacity } from 'react-native';
import { TabbedMessage } from './TabbedMessage';
import { TutorPartKey } from '@/src/components/tabbedMessage/types/TutorPartKey';

const mockStopPropagation = jest.fn();

jest.mock('@/src/providers/ThemeProvider', () => ({
    useTheme: () => ({
        theme: {
            colors: {
                background: '#ffffff',
                border: '#e5e7eb',
                primary: '#3b82f6',
                primaryText: '#ffffff',
                replyMessageBackground: '#f3f4f6',
                text: '#111827',
                textSecondary: '#6b7280',
            },
        },
    }),
}));

jest.mock('@/src/components/themedTouchableOpacity/ThemedTouchableOpacity', () => ({
    ThemedTouchableOpacity: ({ children, onPress, ...rest }: any) => {
        return (
            <MockTouchableOpacity
                {...rest}
                onPress={() => onPress?.({ stopPropagation: mockStopPropagation })}
            >
                {children}
            </MockTouchableOpacity>
        );
    },
}));

jest.mock('@expo/vector-icons/Ionicons', () => 'Ionicons');

describe('TabbedMessage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders nothing when no tab content is available', async () => {
        const { toJSON } = await render(
            <TabbedMessage
                response=" "
                correction=""
                revisedSentence={undefined}
            />
        );

        expect(toJSON()).toBeNull();
    });

    it('renders only tabs with non-empty content and selects the first available tab', async () => {
        const { getByLabelText, queryByLabelText, getByText, queryByText } = await render(
            <TabbedMessage
                response="Tutor reply"
                correction="   "
                revisedSentence="A revised sentence"
            />
        );

        expect(getByText('Tutor reply')).toBeTruthy();
        expect(queryByText('A revised sentence')).toBeNull();
        expect(getByLabelText('Reply')).toBeTruthy();
        expect(queryByLabelText('Correction')).toBeNull();
        expect(getByLabelText('Revised Sentence')).toBeTruthy();
    });

    it('uses a valid initial selected tab', async () => {
        const { getByText, queryByText } = await render(
            <TabbedMessage
                response="Tutor reply"
                correction="Try this correction"
                revisedSentence="A revised sentence"
                initialSelected="correction"
            />
        );

        expect(getByText('Try this correction')).toBeTruthy();
        expect(queryByText('Tutor reply')).toBeNull();
    });

    it('falls back to the first available tab when initial selected content is unavailable', async () => {
        const { getByText, queryByText } = await render(
            <TabbedMessage
                response="Tutor reply"
                correction=""
                revisedSentence="A revised sentence"
                initialSelected="correction"
            />
        );

        expect(getByText('Tutor reply')).toBeTruthy();
        expect(queryByText('A revised sentence')).toBeNull();
    });

    it('switches the selected content and reports selection changes', async () => {
        const onSelectedChange = jest.fn();
        const { getByLabelText, getByText, queryByText } = await render(
            <TabbedMessage
                response="Tutor reply"
                correction="Try this correction"
                revisedSentence="A revised sentence"
                onSelectedChange={onSelectedChange}
            />
        );

        await fireEvent.press(getByLabelText('Revised Sentence'));

        await waitFor(() => {
            expect(getByText('A revised sentence')).toBeTruthy();
            expect(queryByText('Tutor reply')).toBeNull();
            expect(onSelectedChange).toHaveBeenCalledWith('revisedSentence');
            expect(mockStopPropagation).toHaveBeenCalledTimes(1);
        });
    });

    it('does not use an initial selected key that is not one of the rendered tabs', async () => {
        const unavailableInitialSelected = 'unknown' as TutorPartKey;
        const { getByText } = await render(
            <TabbedMessage
                response=""
                correction="Try this correction"
                revisedSentence="A revised sentence"
                initialSelected={unavailableInitialSelected}
            />
        );

        expect(getByText('Try this correction')).toBeTruthy();
    });
});
