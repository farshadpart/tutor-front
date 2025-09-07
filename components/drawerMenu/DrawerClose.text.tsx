import {TouchableOpacity, Text, View, StyleSheet} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface DrawerCloseProps {
    OnOpenMenuButtonClick: (status: boolean) => void;
}

export const DrawerClose = ({OnOpenMenuButtonClick}: DrawerCloseProps) => {
    const handleButtonOnPress = () => {
        OnOpenMenuButtonClick(true);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleButtonOnPress} style={styles.button}>
                <MaterialIcons name="menu" size={24} color="black"/>
            </TouchableOpacity>
            <Text style={styles.title}>Menu</Text>
            <View style={{width: 24}}/>
            {/* این view خالی باعث میشه متن واقعا وسط بمونه */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row", // افقی
        alignItems: "center", // وسط عمودی
        justifyContent: "space-between", // فاصله برابر
        paddingHorizontal: 10,
        height: 50,
        backgroundColor: "rgba(0,0,0,0.1)",
    },
    button: {
        padding: 5, // تاچ راحت‌تر
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        flex: 1, // برای اینکه وسط بیاد
    },
});
