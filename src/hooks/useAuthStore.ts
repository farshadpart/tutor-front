import { login, logout, refresh } from "@/src/services/accountService";
import { LoginRequest } from "@/src/types/account/loginRequest";
import { Result } from "@/src/types/common/result";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { LoginResponse } from "../types/account/loginResponse";
import { TokenHolder } from "../types/account/tokenHolders";
import { User } from "../types/account/user";

type UserTokenState = {
    user?: User;
    tokenHolder?: TokenHolder;
    refresh: (refreshToken: string) => Promise<void>;
    logIn: (loginRequest: LoginRequest) => Promise<Result<LoginResponse>>;
    logOut: (email?: string) => Promise<void>;
    setSubscription: (subscriptionGroup?: string) => void;
};

export const useAuthStore = create(
    persist<UserTokenState>(
        (set) => ({
            user: undefined,
            tokenHolder: undefined,
            refresh: async (refreshToken: string) => {
                const refreshResponse = await refresh({refreshToken});

                set((state) => {
                    return {
                        ...state,
                        user: refreshResponse.data?.user,
                        tokenHolder: refreshResponse.data?.tokenHolder
                    };
                });
            },
            logIn: async (loginRequest: LoginRequest) => {
                const loginResponse = await login(loginRequest);
                set((state) => {
                    return {
                        ...state,
                        user: loginResponse.data?.user,
                        tokenHolder: loginResponse.data?.tokenHolder
                    };
                });

                return loginResponse;
            },
            logOut: async (refreshToken?: string) => {
                const logOutResult = await logout(refreshToken);
                if (!logOutResult) {
                    return;
                }

                set((state) => {
                    return {
                        ...state,
                        user: undefined
                    };
                });
            },
            setSubscription: async (subscriptionGroup?: string) => {
                set((state) => {
                    const userWithUpdatedSubscription = state.user ? { ...state.user, subscriptionGroup } : undefined;

                    return {
                        ...state,
                        user: userWithUpdatedSubscription,
                    };
                });
            },
        }),
        {
            name: "auth-store",
            storage:
                createJSONStorage(() => ({
                    setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
                    getItem: (key: string) => SecureStore.getItemAsync(key),
                    removeItem: (key: string) => SecureStore.deleteItemAsync(key),
                }))
        }
    ),
);