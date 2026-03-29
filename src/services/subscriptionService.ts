import { TUTORAPI } from "@/src/constants/addresses";
import { interpret } from '@/src/services/interpreter';
import { Result } from '@/src/types/common/result';
import { CreateSubscriptionRequest } from "@/src/types/subscription/createSubscriptionRequest";
import { fetchWithTimeout } from '@/src/utilities/httpUitlities';
import { log } from '@/src/services/logService';

export const getSubscriptionGroups = async (): Promise<Result<string[]>> => {
    try {
        const response = await fetch(`${TUTORAPI}/subscription/getSubscriptionGroups`, { method: "GET" });

        return interpret<string[]>(response);
    } catch (e) {
        log("Error", 'Getting the subscription groups failed!', [], e);
        return { isSuccess: false };
    }
}

export const create = async ({ createSubscriptionRequest, accessToken }: { createSubscriptionRequest: CreateSubscriptionRequest, accessToken: string }): Promise<Result> => {
    try {
        const response = await fetchWithTimeout(`${TUTORAPI}/subscription/create`, {
            method: "POST",
            body: JSON.stringify(createSubscriptionRequest),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            }
        });

        return await interpret(response);
    } catch (e) {
        log("Error", 'Activating the subscription for the user failed! CreateSubscriptionRequest: {@CreateSubscriptionRequest}', [createSubscriptionRequest], e);
        return { isSuccess: false }
    }
}

