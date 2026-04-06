import { useAuthStore } from "@/src/hooks/useAuthStore";

export const getValidToken = async (): Promise<string | undefined> => {
    const { tokenHolder, refresh } = useAuthStore.getState();

    if (!tokenHolder) {
        return undefined;
    }

    const oneMinute = 60 * 1000;

    const isValid = new Date(tokenHolder.accessToken.expiration).getTime() >= Date.now() + oneMinute;

    if (isValid) {
        return tokenHolder.accessToken.token;
    }

    return await refresh(tokenHolder.refreshToken.token);
};