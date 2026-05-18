export type PurchaseResult = {
    isSuccess: boolean;
    data?: {
        productId: string;
        purchaseToken: string;
        transactionId?: string;
    };
    error?: string;
};