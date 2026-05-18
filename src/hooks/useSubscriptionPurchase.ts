import { useCallback } from "react";
import { useIAP } from "expo-iap";
import { PurchaseResult} from "@/src/types/subscription/purchaseResult"
import { log } from "@/src/services/logService"

export function useSubscriptionPurchase() {
    const { connected, requestPurchase } = useIAP();

    const purchase = useCallback(
        async (productId: string): Promise<PurchaseResult> => {
            try {
                if (!connected) {
                    log("Trace", "Google Play Store is not connected");
                    return {
                        isSuccess: false,
                        error: "Google Play is not connected.",
                    };
                }

                const purchaseResult = await requestPurchase({
                    type: "subs",
                    request: {
                        google: {
                            skus: [productId],
                        },
                    },
                });
                
                log("Information", "Google Purchase result: {result}", [purchaseResult]);

                const purchaseData = Array.isArray(purchaseResult)
                    ? purchaseResult[0]
                    : purchaseResult;

                if (!purchaseData?.purchaseToken) {
                    return {
                        isSuccess: false,
                        error: "Purchase was cancelled or failed.",
                    };
                }

                return {
                    isSuccess: true,
                    data: {
                        productId: purchaseData.productId,
                        purchaseToken: purchaseData.purchaseToken,
                        transactionId: purchaseData.id,
                    },
                };
            } catch (error: any) {
                return {
                    isSuccess: false,
                    error:
                        error?.message ??
                        "An unexpected error occurred during purchase.",
                };
            }
        },
        [connected, requestPurchase]
    );

    return {
        purchase,
    };
}