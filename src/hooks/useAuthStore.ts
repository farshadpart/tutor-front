import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import * as SecureStore from "expo-secure-store";
import { login, logout } from "@/src/services/accountService"
import { LoginRequest } from "@/src/types/account/loginRequest";
import { User } from "../types/account/user";

type UserState = {
    user?: User;
    accessToken?: string;
    logIn: (loginRequest: LoginRequest) => Promise<boolean>;
    logOut: (email: string) => void;
    setSubscription: (subscriptionGroup?: string) => void;
};

export const useAuthStore = create(
    persist<UserState>(
        (set) => ({
            user: undefined,
            logIn: async (loginRequest: LoginRequest) => {
                const loginResponse = await login(loginRequest);
                set((state) => {
                    return {
                        ...state,
                        user: loginResponse.user,
                        accessToken: loginResponse.accessToken
                    };
                });

                return loginResponse.user !== undefined ? true : false;
            },
            logOut: (email: string) => {
                const logOutResult = logout(email);
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