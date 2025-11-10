import { CreateSubscriptionRequest } from "../interfaces/subscription/createSubscriptionRequest";
import { TUTORAPI } from "./constants";

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
        console.log('Creating Subscription', createSubscriptionRequest);
        const response = await fetch(`${TUTORAPI}/subscription/create`, {
            method: "POST",
            body: JSON.stringify(createSubscriptionRequest),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            }
        });

        console.log('Response Status', response.status); 

        return true;
    } catch (e) {
        console.log('Error', e);
        return false;
    }
}

