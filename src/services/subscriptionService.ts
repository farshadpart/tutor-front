import { TUTORAPI } from "@/src/constants/addresses";
import { interpret } from '@/src/services/interpreter';
import { Result } from '@/src/types/common/result';
import { CreateSubscriptionRequest } from "@/src/types/subscription/createSubscriptionRequest";
import { fetchWithTimeout } from '@/src/utilities/httpUitlities';
import { log } from '@/src/services/logService';
import { getValidToken } from "@/src/services/tokenService";
import {SubscriptionGroup} from "@/src/types/subscription/subscriptionGroup";

export const getSubscriptionGroups = async (): Promise<Result<SubscriptionGroup[]>> => {
    try {
        //const response = await fetch(`${TUTORAPI}/subscription/getSubscriptionGroups`, { method: "GET" });
        //return interpret<SubscriptionGroup[]>(response);

        return {
            isSuccess: true,
            data: [
                {
                    id: "90-days",
                    title: "Basic",
                    priceUsDollars: 59.99,
                    periodInDays: 90,
                    requestCount: 3000,
                    description: 'Basic Features'
                },
                {
                    id: "365-days",
                    title: "Pro",
                    priceUsDollars: 99.99,
                    periodInDays: 365,
                    requestCount: 15000,
                    description: 'Amazing Features'
                }
            ],
            error: undefined
        };
    } catch (e) {
        log("Error", 'Getting the subscription groups failed!', [], e);
        return { isSuccess: false };
    }
}

export const create = async ({ createSubscriptionRequest }: { createSubscriptionRequest: CreateSubscriptionRequest }): Promise<Result> => {
    try {
        const response = await fetchWithTimeout(`${TUTORAPI}/subscription/create`, {
            method: "POST",
            body: JSON.stringify(createSubscriptionRequest),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${await getValidToken()}`,
            }
        });

        return await interpret(response);
    } catch (e) {
        log("Error", 'Activating the subscription for the user failed! CreateSubscriptionRequest: {@CreateSubscriptionRequest}', [createSubscriptionRequest], e);
        return { isSuccess: false }
    }
}

