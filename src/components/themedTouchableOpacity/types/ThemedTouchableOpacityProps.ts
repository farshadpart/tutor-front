import { TouchableOpacityProps, StyleProp, ViewStyle } from 'react-native';

export type ThemedTouchableOpacityProps = TouchableOpacityProps & {
    style?: StyleProp<ViewStyle>;
};