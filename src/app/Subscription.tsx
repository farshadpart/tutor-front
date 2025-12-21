import { getSubscriptionGroups, create } from "@/src/services/subscriptionService";
import { View, Alert, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { useAuthStore } from "../hooks/useAuthStore";
import { ThemedView } from "@/src/components/themedView/ThemedView";
import { ThemedText } from "@/src/components/themedText/ThemedText";
import { ThemedTouchableOpacity } from "@/src/components/themedTouchableOpacity/ThemedTouchableOpacity";

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
            <ThemedView key={group}>
                <ThemedTouchableOpacity style={styles.button} onPress={async () => handleSubscriptionSelect(group)}>
                    <ThemedText style={styles.buttonText}>{group}</ThemedText>
                </ThemedTouchableOpacity>
            </ThemedView>
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
        padding: 20
    },
    button: {
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: "center",
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "600",
    },
});

export default Subscription;