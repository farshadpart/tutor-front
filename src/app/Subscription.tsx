import { ActConfirm } from "@/src/components/modalTemplates/confirm/ActConfirm";
import { useModal } from "@/src/components/themedModal/ThemedModalContext";
import { ThemedText } from "@/src/components/themedText/ThemedText";
import { ThemedTouchableOpacity } from "@/src/components/themedTouchableOpacity/ThemedTouchableOpacity";
import { ThemedView } from "@/src/components/themedView/ThemedView";
import { Messages } from "@/src/constants/messages";
import { useAuthStore } from "@/src/hooks/useAuthStore";
import { useTheme } from "@/src/providers/ThemeProvider";
import { create, getSubscriptionGroups } from "@/src/services/subscriptionService";
import { SubscriptionGroup } from "@/src/types/subscription/subscriptionGroup";
import { usePreventRemove } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {FlatList, ScrollView, StyleSheet, View} from "react-native";
import { SubscriptionGroupCard} from "@/src/components/subscirptionGroupCard/SubscriptionGroupCard";
import { useSubscriptionPurchase } from "@/src/hooks/useSubscriptionPurchase";

export default function Subscription() {
    const { theme } = useTheme();
    const { showModal, closeModal } = useModal();
    const authStore = useAuthStore();
    const { purchase } = useSubscriptionPurchase();

    const [subscriptionGroups, setSubscriptionGroups] = useState<SubscriptionGroup[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<SubscriptionGroup | null>(null);

    const confirmExit = () => {
        showModal({
            children: (
                <ActConfirm
                    dangerousAct={true}
                    title={Messages.warning}
                    message={Messages.ifYouGoBackNowYourProgressWillBeLostAreYouSure}
                    onAct={async() => {
                        await cancelSubscriptionSelection();
                        closeModal();
                    }}
                    onCancel={closeModal}
                />
            ),
        });
    };

    const cancelSubscriptionSelection = async () => {
        await authStore.logOut(authStore.user?.email ?? "");
    };

    useEffect(() => {
        const fetchSubscriptionGroups = async () => {
            const result = await getSubscriptionGroups();

            if (!result.isSuccess) {
                showModal({
                    children: (
                        <ActConfirm
                            title={Messages.error}
                            message={Messages.failedToRetriveTheSubscriptionGroupsPleaseTryLater}
                            onAct={closeModal}
                        />
                    ),
                });
                return;
            }

            const groups = result.data ?? [];

            setSubscriptionGroups(groups);

            if (groups.length > 0) {
                setSelectedGroup(groups[0]);
            }
        };

        fetchSubscriptionGroups().then();
    }, [showModal, closeModal]);

    usePreventRemove(true, () => {
        confirmExit();
    });

    const handleSubscriptionSelect = async () => {
        if (!selectedGroup) {
            return;
        }

        const googlePurchaseResult = await purchase(selectedGroup.id.toString());

        if (!googlePurchaseResult.isSuccess) {
            showModal({
                children: (
                    <ActConfirm
                        onAct={closeModal}
                        title={Messages.subscriptionError}
                        message={Messages.somethingWentWrongWhileProcessingYourSubscription}
                    />
                ),
            });
            return;
        }
        
        const result = await create({
            createSubscriptionRequest: {
                userId: authStore.user!.id,
                subscriptionGroup: selectedGroup.title,
            },
        });

        if (!result.isSuccess) {
            showModal({
                children: (
                    <ActConfirm
                        onAct={closeModal}
                        title={Messages.subscriptionError}
                        message={Messages.somethingWentWrongWhileProcessingYourSubscription}
                    />
                ),
            });
            return;
        }

        authStore.setSubscription(selectedGroup.title);
    };

    return (
        <ThemedView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <ThemedText style={styles.title}>
                    Choose your subscription
                </ThemedText>

                <ThemedText style={styles.subtitle}>
                    Unlock more practice and improve your English faster.
                </ThemedText>

                <View style={styles.benefits}>
                    <ThemedText style={styles.benefit}>• More correction requests</ThemedText>
                    <ThemedText style={styles.benefit}>• Longer access duration</ThemedText>
                    <ThemedText style={styles.benefit}>• Voice and text practice</ThemedText>
                    <ThemedText style={styles.benefit}>• Better support for daily learning</ThemedText>
                </View>

                <View style={styles.groups}>
                    <FlatList
                        horizontal
                        data={subscriptionGroups}
                        keyExtractor={(item) => item.id.toString()}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.subscriptionList}
                        renderItem={({ item }) => (
                            <SubscriptionGroupCard
                                subscirptionGroup={item}
                                selected={selectedGroup?.id === item.id}
                                onPress={() => setSelectedGroup(item)}
                            />
                        )}
                    />
                </View>

                <ThemedTouchableOpacity
                    style={[
                        styles.continueButton,
                        { backgroundColor: theme.colors.primary },
                    ]}
                    onPress={handleSubscriptionSelect}
                >
                    <ThemedText style={styles.continueButtonText}>
                        Continue
                    </ThemedText>
                </ThemedTouchableOpacity>

                <ThemedTouchableOpacity
                    style={[
                        styles.cancelButton,
                        { backgroundColor: theme.colors.destructiveBackground },
                    ]}
                    onPress={cancelSubscriptionSelection}
                >
                    <ThemedText
                        style={[
                            styles.cancelButtonText,
                            { color: theme.colors.destructive },
                        ]}
                    >
                        Cancel
                    </ThemedText>
                </ThemedTouchableOpacity>
            </ScrollView>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    subscriptionList: {
        paddingHorizontal: 16,
        gap: 12,
    },
    
    container: {
        flex: 1,
    },
    content: {
        flexGrow: 1,
        padding: 20,
        justifyContent: "center",
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        textAlign: "center",
        opacity: 0.75,
        marginBottom: 24,
    },
    benefits: {
        marginBottom: 24,
        gap: 8,
    },
    benefit: {
        fontSize: 15,
        opacity: 0.85,
    },
    groups: {
        gap: 12,
        marginBottom: 24,
    },
    card: {
        borderWidth: 2,
        borderRadius: 16,
        padding: 16,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    groupTitle: {
        fontSize: 20,
        fontWeight: "700",
    },
    selectedText: {
        fontSize: 13,
        fontWeight: "700",
    },
    price: {
        fontSize: 26,
        fontWeight: "800",
        marginBottom: 2,
    },
    period: {
        fontSize: 14,
        opacity: 0.7,
        marginBottom: 10,
    },
    description: {
        fontSize: 15,
        opacity: 0.85,
    },
    continueButton: {
        borderRadius: 12,
        paddingVertical: 15,
        alignItems: "center",
    },
    continueButtonText: {
        fontSize: 17,
        fontWeight: "700",
        color: "white",
    },
    cancelButton: {
        marginTop: 10,
        borderRadius: 12,
        paddingVertical: 15,
        alignItems: "center",
    },
    cancelButtonText: {
        fontSize: 17,
        fontWeight: "700",
    },
});