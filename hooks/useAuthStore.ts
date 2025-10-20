import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import * as SecureStore from "expo-secure-store";
import { login, register, logout } from "../services/accountService"
import { RegisterRequest } from "../interfaces/account/registerRequest"

export interface LoginRequest {
    email: string,
    password: string
}

interface Claim {
    Type: string,
    Value: string
}

export interface User {
    email: string,
    claims: Claim[]
}

type UserState = {
    user?: User;
    logIn: (loginRequest: LoginRequest) => void;
    register: (registerRequest: RegisterRequest) => void;
    logOut: (email: string) => void;
};

export const useAuthStore = create(
    persist<UserState>(
        (set) => ({
            user: undefined,
            logIn: (loginRequest: LoginRequest) => {
                const user = login(loginRequest);
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
            },
            register: (registerRequest: RegisterRequest) => {
                const user = register(registerRequest);
                set((state) => {
                    return {
                        ...state,
                        user
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