import { ActConfirm } from "@/src/components/modalTemplates/confirm/ActConfirm";
import { useModal } from "@/src/components/themedModal/ThemedModalContext";
import { ThemedText } from "@/src/components/themedText/ThemedText";
import { ThemedTouchableOpacity } from "@/src/components/themedTouchableOpacity/ThemedTouchableOpacity";
import { ThemedView } from "@/src/components/themedView/ThemedView";
import { useAuthStore } from '@/src/hooks/useAuthStore';
import { useToken } from "@/src/hooks/useToken";
import { useTheme } from '@/src/providers/ThemeProvider';
import { create, getSubscriptionGroups } from "@/src/services/subscriptionService";
import { usePreventRemove } from '@react-navigation/native';
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

const Subscription = () => {
    const { theme } = useTheme();
    const { showModal, closeModal } = useModal();
    const token = useToken();
    const authStore = useAuthStore();
    const [subscriptionGroups, setSubscriptionGroups] = useState<string[]>([]);

    const confirmExit = () => {
        showModal({
            children: <ActConfirm dangerousAct={true} title='Warning' message='If you go back now, your progress will be lost. Are you sure?'
                onAct={() => { cancelSubscriptionSelection(); closeModal(); }} onCancel={closeModal} />
        })
    }

    const cancelSubscriptionSelection = () => {
        authStore.logOut(authStore.user?.email ?? '');
    }

    useEffect(() => {
        const fetchSubscriptionGroups = async () => {
            const subscriptionGroupResult = await getSubscriptionGroups();
            if (!subscriptionGroupResult.isSuccess) {
                showModal({ children: <ActConfirm title='Error' message='Failed to retrive the subscription groups, please try later!' onAct={closeModal} /> })
                return;
            }

            const subscriptionGroups = subscriptionGroupResult.data ?? [];
            setSubscriptionGroups(subscriptionGroups);
        };
        fetchSubscriptionGroups().then();
    }, [showModal, closeModal]);

    usePreventRemove(true, () => {
        confirmExit();
    });

    const renderSubscriptionGroups = () => {
        return subscriptionGroups.map(group =>
            <ThemedView key={group}>
                <ThemedTouchableOpacity style={styles.button} onPress={async () => handleSubscriptionSelect(group)}>
                    <ThemedText style={styles.buttonText}>{group}</ThemedText>
                </ThemedTouchableOpacity>

                <ThemedTouchableOpacity style={[styles.buttonCancel, { backgroundColor: theme.colors.destructiveBackground }]} onPress={cancelSubscriptionSelection}>
                    <ThemedText style={[styles.buttonText, { color: theme.colors.destructive }]}>Cancel</ThemedText>
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
            accessToken: token ?? ""
        });

        if (!result.isSuccess) {
            showModal({ children: <ActConfirm onAct={closeModal} title="Subscription Error" message="Something went wrong while processing your subscription." /> });
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
    buttonCancel: {
        marginTop: 8,
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