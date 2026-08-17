import { render, waitFor } from '@testing-library/react-native';
import ChatScreen from './ChatScreen';
import { getChatHistory } from '@/src/services/messageService';

const mockStopPlayback = jest.fn();
const mockSetHotMessage = jest.fn();

jest.mock('@/src/providers/AudioPlayerProvider', () => ({
    useAudioPlayerProvider: () => ({
        setHotMessage: mockSetHotMessage,
        stopPlayback: mockStopPlayback,
    }),
}));

jest.mock('@/src/components/chatBox/ChatBox', () => ({
    ChatBox: () => null,
}));

jest.mock('@/src/components/themedModal/ThemedModalContext', () => ({
    useModal: () => ({
        showModal: jest.fn(),
        closeModal: jest.fn(),
    }),
}));

jest.mock('@/src/hooks/useAuthStore', () => ({
    useAuthStore: () => ({ user: { id: 'user-1' } }),
}));

jest.mock('@/src/services/messageService', () => ({
    getChatHistory: jest.fn(),
    saveChatHistory: jest.fn(),
    upsertChatInfo: jest.fn(),
}));

jest.mock('@/src/services/tutorApiService', () => ({
    chat: jest.fn(),
    transcription: jest.fn(),
}));

jest.mock('@/src/services/fileService', () => ({
    saveAudio: jest.fn(),
}));

const mockGetChatHistory = jest.mocked(getChatHistory);

describe('ChatScreen playback lifecycle', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockStopPlayback.mockResolvedValue(undefined);
        mockGetChatHistory.mockResolvedValue([]);
    });

    it('stops Tutor playback when the user changes chats', async () => {
        const { rerender } = await render(<ChatScreen chatId="chat-1" />);

        await waitFor(() => {
            expect(mockStopPlayback).toHaveBeenCalledTimes(1);
        });

        await rerender(<ChatScreen chatId="chat-2" />);

        await waitFor(() => {
            // Cleanup for chat-1 and entry into chat-2 both ensure playback is stopped.
            expect(mockStopPlayback).toHaveBeenCalledTimes(3);
        });
    });

    it('stops Tutor playback when the user leaves the conversation', async () => {
        const { unmount } = await render(<ChatScreen chatId="chat-1" />);

        await waitFor(() => {
            expect(mockStopPlayback).toHaveBeenCalledTimes(1);
        });

        await unmount();

        expect(mockStopPlayback).toHaveBeenCalledTimes(2);
    });
});
