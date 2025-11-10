import { getSubscriptionGroups, create } from "../services/subscriptionService";
import { View, TouchableOpacity, Alert, StyleSheet, Text } from "react-native";
import { useEffect, useState } from "react";
import { useAuthStore } from "../hooks/useAuthStore";

const Subscription = () => {
    const authStore = useAuthStore();
    const [subscriptionGroups, setSubscriptionGroups] = useState<string[]>([]);
    useEffect(() => {
        const fetchSubscriptionGroups = async () => {
            setSubscriptionGroups(await getSubscriptionGroups());
        };
        fetchSubscriptionGroups().then();
    }, []);

    const renderSubscriptionGroups = () => {
        return subscriptionGroups.map(group =>
            <View key={group}>
                <TouchableOpacity style={styles.button} onPress={async () => handleSubscriptionSelect(group)}>
                    <Text style={styles.buttonText}>{group}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handleSubscriptionSelect = async (group: string) => {
        const result = await create({
            createSubscriptionRequest: {
                userId: authStore.user!.id,
                subscriptionGroup: group
            },
            accessToken: authStore.accessToken ?? ""
        });
        if (!result) {
            Alert.alert("Subscription Error", "Something went wrong while processing your subscription. Don't worry - no charges were made. Please try again in a moment.");
            return;
        }

        authStore.setSubscription(group);
    }

    return (
        <View style={styles.container}>
            {renderSubscriptionGroups()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#f9fafb",
    },
    button: {
        backgroundColor: "#2563eb",
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
});

export default Subscription;