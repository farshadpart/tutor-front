import {SubscriptionGroup} from "@/src/types/subscription/subscriptionGroup";

export type SubscriptionGroupCardProps = {
    subscirptionGroup: SubscriptionGroup,
    selected: boolean,
    onPress: () => void
}