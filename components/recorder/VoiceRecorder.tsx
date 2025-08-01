import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { useEffect } from 'react';
import { Alert, Button, StyleSheet, View } from 'react-native';

type VoiceRecorderProps = {
  onRecordingComplete?: (audio: {
    uri: string;
    name: string;
    type: string;
  }) => void;
};

export const VoiceRecorder = ({ onRecordingComplete }: VoiceRecorderProps) => {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);

  const record = async () => {
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
  };

  const stopRecording = async () => {
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
        Alert.alert('Permission to access microphone was denied');
      }

      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Button
        title={recorderState.isRecording ? 'Stop Recording' : 'Start Recording'}
        onPress={recorderState.isRecording ? stopRecording : record}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 10,
  },
});