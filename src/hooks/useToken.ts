    import { useAuthStore } from "@/src/hooks/useAuthStore";
    
    export const useToken = () : string|null => {
        const oneMinute = 60 * 1000;
        const { tokenHolder, refresh} = useAuthStore();

        if(tokenHolder === null || tokenHolder === undefined){
            return null;
        }

        const isAccessTokenValid = new Date(tokenHolder.accessToken.expiration).getTime() >= (Date.now() + oneMinute) ? true : false;
        if(isAccessTokenValid){
            return tokenHolder.accessToken.token;
        }

        refresh(tokenHolder.refreshToken.token).then();
        return tokenHolder.accessToken.token;
    }