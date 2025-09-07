import { useState } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { DrawerOpen } from "@/components/drawerMenu/DrowOpen";
import { DrawerClose } from "@/components/drawerMenu/DrawerClose.text";

export const DrawerMenu = () => {
    const [drawerStatus, setDrawerStatus] = useState(false);

    return (
        <View style={styles.container}>
            <DrawerClose OnOpenMenuButtonClick={setDrawerStatus} />
            
            {drawerStatus && (
                <>
                    <Pressable style={styles.backdrop} onPress={() => setDrawerStatus(false)} />
                    <View style={styles.drawer}>
                        <DrawerOpen />
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backdrop: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    drawer: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0, // or "right: 0" depending on drawer direction
        width: 240,
        backgroundColor: "white",
        elevation: 5, // shadow for Android
        shadowColor: "#000", // shadow for iOS
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
});
