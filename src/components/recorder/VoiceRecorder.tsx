import Entypo from '@expo/vector-icons/Entypo';
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { useEffect } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';

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
    <View>
      <TouchableOpacity style={styles.iconButton} onPress={recorderState.isRecording ? stopRecording : record}>
        {recorderState.isRecording ? (
          <Entypo name="controller-stop" size={24} color="black" />
        ) : (
          <Entypo name="mic" size={24} color="black" />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  iconButton: {
     paddingHorizontal: 10
  },
});