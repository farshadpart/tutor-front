import { TouchableOpacityProps, StyleProp, ViewStyle, GestureResponderEvent } from 'react-native';

export type ThemedTouchableOpacityProps = Omit<TouchableOpacityProps, 'onPress'> & {
        style?: StyleProp<ViewStyle>;
        onPress?: (event: GestureResponderEvent) => void | Promise<void>;
    };