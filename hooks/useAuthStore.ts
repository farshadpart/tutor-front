import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import * as SecureStore from "expo-secure-store";
import { login, logout } from "../services/accountService"

export interface LoginRequest {
    email: string,
    password: string
}

export interface Claim {
    type: string,
    value: string
}

export interface User {
    email: string,
    claims: Claim[]
}

type UserState = {
    user?: User;
    logIn: (loginRequest: LoginRequest) => void;
    logOut: (email: string) => void;
};

export const useAuthStore = create(
    persist<UserState>(
        (set) => ({
            user: undefined,
            logIn: async (loginRequest: LoginRequest) => {
                const user = await login(loginRequest);
                set((state) => {
                    return {
                        ...state,
                        user
                    };
                });
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
            }
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