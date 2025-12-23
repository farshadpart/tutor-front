import { CreateSubscriptionRequest } from "@/src/types/subscription/createSubscriptionRequest";
import { TUTORAPI } from "@/src/constants/addresses";

export const getSubscriptionGroups = async (): Promise<string []> => {
    try {
        const response = await fetch(`${TUTORAPI}/subscription/getSubscriptionGroups`, { method: "GET" });

        const result = JSON.parse(await response.text()) as string[];
        return result;
    } catch (e) {
        console.log('Error', e);
        return [];
    }
}

export const create = async ({ createSubscriptionRequest, accessToken }: { createSubscriptionRequest: CreateSubscriptionRequest, accessToken: string }) : Promise<boolean> => {
    try {
        const response = await fetch(`${TUTORAPI}/subscription/create`, {
            method: "POST",
            body: JSON.stringify(createSubscriptionRequest),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            }
        });

        return true;
    } catch (e) {
        console.log('Error', e);
        return false;
    }
}

