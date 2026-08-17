import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { TouchableOpacity as MockTouchableOpacity } from 'react-native';
import { TabbedMessage } from './TabbedMessage';
import { TutorPartKey } from '@/src/components/tabbedMessage/types/TutorPartKey';
import { useUserSettingsProvider } from '@/src/providers/UserSettingsProvider';

const mockStopPropagation = jest.fn();
const mockHandlePlayTap = jest.fn();
const mockSetHotMessage = jest.fn();
let mockHotMessage: string | undefined;

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

jest.mock('@/src/providers/AudioPlayerProvider', () => ({
    useAudioPlayerProvider: () => ({
        handlePlayTap: mockHandlePlayTap,
        hotMessage: mockHotMessage,
        setHotMessage: mockSetHotMessage,
    }),
}));

jest.mock('@/src/providers/UserSettingsProvider', () => ({
    useUserSettingsProvider: jest.fn(),
}));

const mockUseUserSettingsProvider = jest.mocked(useUserSettingsProvider);

describe('TabbedMessage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockHotMessage = undefined;
        mockUseUserSettingsProvider.mockReturnValue({
            autoPlayVoice: false,
            isSaving: false,
            updateAutoPlayVoice: jest.fn(),
        });
    });

    it('automatically plays a hot message when auto-play is enabled', async () => {
        mockHotMessage = 'message-auto-play';
        mockUseUserSettingsProvider.mockReturnValue({
            autoPlayVoice: true,
            isSaving: false,
            updateAutoPlayVoice: jest.fn(),
        });

        await render(
            <TabbedMessage
                messageId="message-auto-play"
                response="Tutor reply"
                audioUrl="https://example.com/reply.mp3"
            />
        );

        await waitFor(() => {
            expect(mockHandlePlayTap).toHaveBeenCalledWith('https://example.com/reply.mp3');
            expect(mockSetHotMessage).toHaveBeenCalledWith(undefined);
        });
    });

    it('does not automatically play a hot message when auto-play is disabled', async () => {
        mockHotMessage = 'message-no-auto-play';

        await render(
            <TabbedMessage
                messageId="message-no-auto-play"
                response="Tutor reply"
                audioUrl="https://example.com/reply.mp3"
            />
        );

        expect(mockHandlePlayTap).not.toHaveBeenCalled();
        expect(mockSetHotMessage).not.toHaveBeenCalled();
    });

    it('renders nothing when no tab content is available', async () => {
        const { toJSON } = await render(
            <TabbedMessage
                messageId="message-1"
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
                messageId="message-2"
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
                messageId="message-3"
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
                messageId="message-4"
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
                messageId="message-5"
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
                messageId="message-6"
                response=""
                correction="Try this correction"
                revisedSentence="A revised sentence"
                initialSelected={unavailableInitialSelected}
            />
        );

        expect(getByText('Try this correction')).toBeTruthy();
    });
});
