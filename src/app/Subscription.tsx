import { ActConfirm } from "@/src/components/modalTemplates/confirm/ActConfirm";
import { useModal } from "@/src/components/themedModal/ThemedModalContext";
import { ThemedText } from "@/src/components/themedText/ThemedText";
import { ThemedTouchableOpacity } from "@/src/components/themedTouchableOpacity/ThemedTouchableOpacity";
import { ThemedView } from "@/src/components/themedView/ThemedView";
import { create, getSubscriptionGroups } from "@/src/services/subscriptionService";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { useAuthStore } from "../hooks/useAuthStore";

const Subscription = () => {
    const { showModal, closeModal } = useModal();
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
            showModal({ children: <ActConfirm onAct={closeModal} title="Subscription Error" message="Something went wrong while processing your subscription."/>});
            return;
        }

        authStore.setSubscription(group);
    }

    return (
        <ThemedView style={styles.container}>
            {renderSubscriptionGroups()}
        </ThemedView>
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