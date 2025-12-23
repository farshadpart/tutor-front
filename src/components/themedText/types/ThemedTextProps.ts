import { TextProps, StyleProp, TextStyle } from 'react-native';

export type ThemedTextProps = TextProps & {
    style?: StyleProp<TextStyle>;
};