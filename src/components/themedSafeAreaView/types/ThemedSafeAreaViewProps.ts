import { ViewProps, StyleProp, ViewStyle } from 'react-native';

export type ThemedSafeAreaViewProps = ViewProps & {
    style?: StyleProp<ViewStyle>;
};