import { fireEvent, render, waitFor } from '@testing-library/react-native';
import {
    ToastAndroid,
    TouchableOpacity as MockTouchableOpacity,
    View as MockView,
} from 'react-native';
import {
    AudioModule,
    setAudioModeAsync,
    useAudioRecorderState,
} from 'expo-audio';
import { VoiceRecorder } from './VoiceRecorder';
import { Messages } from '@/src/constants/messages';

const mockShowModal = jest.fn();
const mockCloseModal = jest.fn();
const mockPrepareToRecordAsync = jest.fn();
const mockRecord = jest.fn();
const mockStop = jest.fn();
const mockStopPlayback = jest.fn();

let mockRecorderState = { isRecording: false };
const mockAudioRecorder = {
    prepareToRecordAsync: mockPrepareToRecordAsync,
    record: mockRecord,
    stop: mockStop,
    uri: 'file:///recordings/lesson.m4a',
};

jest.mock('@/src/providers/ThemeProvider', () => ({
    useTheme: () => ({
        theme: {
            colors: {
                background: '#ffffff',
                primary: '#3b82f6',
                text: '#1f2937',
            },
        },
    }),
}));

jest.mock('@/src/providers/AudioPlayerProvider', () => ({
    useAudioPlayerProvider: () => ({
        stopPlayback: mockStopPlayback,
    }),
}));

jest.mock('@/src/components/themedModal/ThemedModalContext', () => ({
    useModal: () => ({
        showModal: mockShowModal,
        closeModal: mockCloseModal,
    }),
}));

jest.mock('@/src/components/themedTouchableOpacity/ThemedTouchableOpacity', () => ({
    ThemedTouchableOpacity: ({ children, onPress, style }: any) => {
        return (
            <MockTouchableOpacity testID="voice-recorder-button" onPress={onPress} style={style}>
                {children}
            </MockTouchableOpacity>
        );
    },
}));

jest.mock('@/src/components/themedView/ThemedView', () => ({
    ThemedView: ({ children }: any) => {
        return <MockView>{children}</MockView>;
    },
}));

jest.mock('@/src/components/modalTemplates/confirm/ActConfirm', () => ({
    ActConfirm: () => null,
}));

jest.mock('@expo/vector-icons/Entypo', () => 'Entypo');

jest.mock('expo-audio', () => ({
    AudioModule: {
        requestRecordingPermissionsAsync: jest.fn(),
    },
    RecordingPresets: {
        HIGH_QUALITY: 'high-quality',
    },
    setAudioModeAsync: jest.fn(),
    useAudioRecorder: jest.fn(() => mockAudioRecorder),
    useAudioRecorderState: jest.fn(() => mockRecorderState),
}));

describe('VoiceRecorder', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useRealTimers();
        mockRecorderState = { isRecording: false };
        mockAudioRecorder.uri = 'file:///recordings/lesson.m4a';
        (AudioModule.requestRecordingPermissionsAsync as jest.Mock).mockResolvedValue({ granted: true });
        (setAudioModeAsync as jest.Mock).mockResolvedValue(undefined);
        mockPrepareToRecordAsync.mockResolvedValue(undefined);
        mockStop.mockResolvedValue(undefined);
        mockStopPlayback.mockResolvedValue(undefined);
    });

    it('requests microphone permission and enables recording audio mode', async () => {
        await render(<VoiceRecorder />);

        await waitFor(() => {
            expect(AudioModule.requestRecordingPermissionsAsync).toHaveBeenCalledTimes(1);
            expect(setAudioModeAsync).toHaveBeenCalledWith({
                playsInSilentMode: true,
                allowsRecording: true,
            });
        });

        expect(mockShowModal).not.toHaveBeenCalled();
    });

    it('shows the microphone permission modal when access is denied', async () => {
        (AudioModule.requestRecordingPermissionsAsync as jest.Mock).mockResolvedValue({ granted: false });

        await render(<VoiceRecorder />);

        await waitFor(() => {
            expect(mockShowModal).toHaveBeenCalledWith(
                expect.objectContaining({
                    children: expect.any(Object),
                })
            );
        });
    });

    it('stops Tutor playback before starting recording', async () => {
        const { getByTestId } = await render(<VoiceRecorder />);

        await fireEvent.press(getByTestId('voice-recorder-button'));

        await waitFor(() => {
            expect(mockStopPlayback).toHaveBeenCalledTimes(1);
            expect(mockPrepareToRecordAsync).toHaveBeenCalledTimes(1);
            expect(mockRecord).toHaveBeenCalledTimes(1);
        });

        expect(mockStopPlayback.mock.invocationCallOrder[0])
            .toBeLessThan(mockPrepareToRecordAsync.mock.invocationCallOrder[0]);
    });

    it('stops recording and passes the audio file to the completion handler', async () => {
        mockRecorderState = { isRecording: true };
        (useAudioRecorderState as jest.Mock).mockImplementation(() => mockRecorderState);
        const onRecordingComplete = jest.fn();
        const { getByTestId } = await render(
            <VoiceRecorder onRecordingComplete={onRecordingComplete} />
        );

        await fireEvent.press(getByTestId('voice-recorder-button'));

        await waitFor(() => {
            expect(mockStop).toHaveBeenCalledTimes(1);
            expect(onRecordingComplete).toHaveBeenCalledWith({
                uri: 'file:///recordings/lesson.m4a',
                name: 'lesson.m4a',
                type: 'audio/m4a',
            });
        });
    });

    it('auto-stops after 60 seconds and shows the limit toast', async () => {
        jest.useFakeTimers();
        jest.spyOn(ToastAndroid, 'show').mockImplementation(jest.fn());
        const onRecordingComplete = jest.fn();
        const { getByTestId } = await render(
            <VoiceRecorder onRecordingComplete={onRecordingComplete} />
        );

        await fireEvent.press(getByTestId('voice-recorder-button'));

        await waitFor(() => expect(mockRecord).toHaveBeenCalledTimes(1));
        jest.runOnlyPendingTimers();

        await waitFor(() => {
            expect(mockStop).toHaveBeenCalledTimes(1);
            expect(ToastAndroid.show).toHaveBeenCalledWith(
                Messages.audioMessagesAreLimitedTo60Seconds,
                ToastAndroid.SHORT
            );
            expect(onRecordingComplete).toHaveBeenCalledWith({
                uri: 'file:///recordings/lesson.m4a',
                name: 'lesson.m4a',
                type: 'audio/m4a',
            });
        });
    });
});
