import { TextInputProps, StyleProp, TextStyle } from 'react-native';

export type ThemedTextInputProps = TextInputProps & {
    style?: StyleProp<TextStyle>;
};