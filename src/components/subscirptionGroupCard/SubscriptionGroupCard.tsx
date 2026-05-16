import {ThemedText} from "@/src/components/themedText/ThemedText";
import { ThemedTouchableOpacity } from '@/src/components/themedTouchableOpacity/ThemedTouchableOpacity';
import {StyleSheet} from "react-native";
import {SubscriptionGroupCardProps} from "@/src/components/subscirptionGroupCard/types/SubscriptionGroupCardProps";

export function SubscriptionGroupCard ({ subscirptionGroup, selected, onPress } : SubscriptionGroupCardProps) {
    return (
        <ThemedTouchableOpacity onPress={onPress} style={[styles.card, selected && styles.selectedCard,]}>
             <ThemedText style={styles.title}>{subscirptionGroup.title}</ThemedText>
             <ThemedText style={styles.price}>${subscirptionGroup.priceUsDollars}</ThemedText>
             <ThemedText style={styles.period}>{subscirptionGroup.periodInDays} days </ThemedText>
             <ThemedText style={styles.period}>{subscirptionGroup.requestCount} requests </ThemedText>
             <ThemedText style={styles.description}>{subscirptionGroup.description}</ThemedText>
        </ThemedTouchableOpacity>
    );
}

const styles = StyleSheet.create({
    subscriptionList: {
        paddingHorizontal: 16,
        gap: 12,
    },

    card: {
        width: 260,
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        marginRight: 12,
    },

    selectedCard: {
        borderWidth: 2,
    },

    title: {
        fontSize: 20,
        fontWeight: "700",
    },

    price: {
        fontSize: 28,
        fontWeight: "800",
        marginTop: 12,
    },

    period: {
        marginTop: 4,
        opacity: 0.7,
    },

    description: {
        marginTop: 12,
        lineHeight: 20,
    },
});