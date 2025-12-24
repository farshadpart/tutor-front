import { TUTORAPI } from "@/src/constants/addresses";
import { interpret } from '@/src/services/interpreter';
import { Result } from '@/src/types/common/result';
import { CreateSubscriptionRequest } from "@/src/types/subscription/createSubscriptionRequest";

export const getSubscriptionGroups = async (): Promise<Result<string[]>> => {
    try {
        const response = await fetch(`${TUTORAPI}/subscription/getSubscriptionGroups`, { method: "GET" });

        return interpret<string[]>(response);
    } catch (e) {
        console.log(e, 'Getting the subscription groups failed!');
        return { isSuccess: false };
    }
}

export const create = async ({ createSubscriptionRequest, accessToken }: { createSubscriptionRequest: CreateSubscriptionRequest, accessToken: string }): Promise<Result> => {
    try {
        const response = await fetch(`${TUTORAPI}/subscription/create`, {
            method: "POST",
            body: JSON.stringify(createSubscriptionRequest),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            }
        });

        return await interpret(response);
    } catch (e) {
        console.error(e, 'Activating the subscription for the user failed!');
        return { isSuccess: false }
    }
}

