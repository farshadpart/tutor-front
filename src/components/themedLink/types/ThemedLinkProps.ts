import { TextProps, StyleProp, TextStyle } from 'react-native';
import { LinkProps } from 'expo-router';

export type ThemedLinkProps = {
    style?: StyleProp<TextStyle>;
    href: LinkProps['href'];
} & Omit<TextProps, 'onPress'>;