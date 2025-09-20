import React, { useEffect, useState } from "react";
import {
    View,
    Keyboard,
    LayoutAnimation,
    Platform,
    StyleSheet,
    ViewStyle,
    TouchableWithoutFeedback
} from "react-native";

type Props = {
    children: React.ReactNode;
    style?: ViewStyle;
    extraHeight?: number; // extra padding above keyboard
};

export default function KeyboardShiftView({
    children,
    style,
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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={[styles.container, style, { paddingBottom: keyboardOffset }]}>
                {children}
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
