import { ViewProps, StyleProp, ViewStyle } from 'react-native';

export type ThemedViewProps = ViewProps & {
    style?: StyleProp<ViewStyle>;
};