import React, { useEffect, useState, ReactNode } from "react";
import {
    Keyboard,
    LayoutAnimation,
    Platform,
    StyleSheet,
    ViewStyle,
    Pressable,
    View
} from "react-native";

type Props = {
    children: ReactNode;
    style?: ViewStyle;
    scrollable?: boolean;
    extraHeight?: number;
};

export default function KeyboardShiftView({
    children,
    style,
    scrollable = false,
    extraHeight = 20,
}: Props) {
    const [keyboardOffset, setKeyboardOffset] = useState(0);

    useEffect(() => {
        const showSub = Keyboard.addListener(
            Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
            (e) => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setKeyboardOffset(e.endCoordinates.height + extraHeight);
            }
        );

        const hideSub = Keyboard.addListener(
            Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
            () => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setKeyboardOffset(0);
            }
        );

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, [extraHeight]);

    return (
        scrollable ?
            <View style={[styles.container, style, { paddingBottom: keyboardOffset }]}>
                {children}
            </View>
            :
            <Pressable style={[styles.container, style, { paddingBottom: keyboardOffset }]} onPress={Keyboard.dismiss}>
                {children}
            </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
