import { ActConfirm } from '@/src/components/modalTemplates/confirm/ActConfirm';
import { useModal } from '@/src/components/themedModal/ThemedModalContext';
import { ThemedTouchableOpacity } from '@/src/components/themedTouchableOpacity/ThemedTouchableOpacity';
import { ThemedView } from '@/src/components/themedView/ThemedView';
import { Messages } from '@/src/constants/messages';
import { useTheme } from '@/src/providers/ThemeProvider';
import Entypo from '@expo/vector-icons/Entypo';
import {
    AudioModule,
    RecordingPresets,
    setAudioModeAsync,
    useAudioRecorder,
    useAudioRecorderState,
} from 'expo-audio';
import { useEffect, useRef } from 'react';
import { StyleSheet, ToastAndroid } from 'react-native';

type VoiceRecorderProps = {
    onRecordingComplete?: (audio: {
        uri: string;
        name: string;
        type: string;
    }) => void;
};

export const VoiceRecorder = ({ onRecordingComplete }: VoiceRecorderProps) => {
    const oneMinute = 60000;
    const { showModal, closeModal } = useModal();
    const { theme } = useTheme();
    const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
    const recorderState = useAudioRecorderState(audioRecorder);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const showLimitToast = () => {
        ToastAndroid.show(Messages.audioMessagesAreLimitedTo60Seconds, ToastAndroid.SHORT);
    };

    const record = async () => {
        await audioRecorder.prepareToRecordAsync();
        audioRecorder.record();

        timerRef.current = setTimeout(async () => {
            await stopRecording();
            showLimitToast();
        }, oneMinute);
    };

    const stopRecording = async () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        await audioRecorder.stop();

        if (audioRecorder.uri && onRecordingComplete) {
            const uri = audioRecorder.uri;
            const fileType = 'audio/m4a';
            const fileName = uri.split('/').pop() ?? 'recording.m4a';

            onRecordingComplete({
                uri,
                name: fileName,
                type: fileType,
            });
        }
    };

    useEffect(() => {
        (async () => {
            const status = await AudioModule.requestRecordingPermissionsAsync();
            if (!status.granted) {
                showModal({ children: <ActConfirm onAct={closeModal} title={Messages.error} message={Messages.microphoneAccessWasDeniedPleaseEnableMicrophonePermissionToRecordAudio} /> });
            }

            await setAudioModeAsync({
                playsInSilentMode: true,
                allowsRecording: true,
            });
        })();
    }, [showModal, closeModal]);

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    return (
        <ThemedView>
            <ThemedTouchableOpacity style={[styles.iconButton, { backgroundColor: theme.colors.background }]} onPress={recorderState.isRecording ? stopRecording : record}>
                {
                    recorderState.isRecording
                        ? <Entypo name="controller-stop" size={24} color={theme.colors.text} />
                        : <Entypo name="mic" size={24} color={theme.colors.text} />
                }
            </ThemedTouchableOpacity>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    iconButton: {
        paddingHorizontal: 10
    },
});