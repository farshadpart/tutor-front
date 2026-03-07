import { TUTORAPI } from "@/src/constants/addresses";
import { interpret } from "@/src/services/interpreter";
import { Claim } from "@/src/types/account/claim";
import { LoginRequest } from "@/src/types/account/loginRequest";
import { LoginResponse } from "@/src/types/account/loginResponse";
import { RegisterRequest } from "@/src/types/account/registerRequest";
import { User } from "@/src/types/account/user";
import { Result } from "@/src/types/common/result";
import { jwtDecode } from "jwt-decode";
import { RefreshRequest } from "../types/account/refreshRequest";
import { RefreshResponse } from "../types/account/refreshResponse";
import { TokenHolder } from "../types/account/tokenHolders";
import { fetchWithTimeout } from '@/src/utilities/httpUitlities'

export const login = async (loginRequest: LoginRequest): Promise<Result<LoginResponse>> => {
    try {
        const response = await fetchWithTimeout(`${TUTORAPI}/account/login`, {
            method: "POST",
            body: JSON.stringify(loginRequest),
            headers: {
                "Content-Type": "application/json",
            }
        });

        const loginResponse = await interpret<TokenHolder>(response);
        if (!loginResponse.isSuccess || loginResponse.data === undefined) {
            return { isSuccess: false };
        }

        const user = mapTokenToUser(loginResponse.data.accessToken.token);
        return {
            isSuccess: true, data: { user, tokenHolder: loginResponse.data }
        }
    } catch (e) {
        console.error('Error', e);
        return { isSuccess: false, error: "Something went wrong!"};
    }
}

export const refresh = async (refreshRequest: RefreshRequest): Promise<Result<RefreshResponse>> => {
    try {
        const response = await fetchWithTimeout(`${TUTORAPI}/account/refresh`, {
            method: "POST",
            body: JSON.stringify(refreshRequest),
            headers: {
                "Content-Type": "application/json",
            }
        });

        const refreshResponse = await interpret<TokenHolder>(response);
        if (!refreshResponse.isSuccess || refreshResponse.data === undefined) {
            return {isSuccess: false};
        }

        const user = mapTokenToUser(refreshResponse.data.accessToken.token);
        return {
            isSuccess: true, data: { user, tokenHolder: refreshResponse.data }
        }
    } catch (e) {
        console.error('Error', e);
        return { isSuccess: false, error: "Something went wrong!"};
    }
}

export const logout = async (refreshToken?: string) : Promise<Result> => {
    try {
        const response = await fetchWithTimeout(`${TUTORAPI}/account/logout`, {
            method: "POST",
            body: JSON.stringify({ refreshToken }),
            headers: {
                "Content-Type": "application/json",
            }
        });

        const refreshResponse = await interpret(response);
        if (!refreshResponse.isSuccess || refreshResponse.data === undefined) {
            return { isSuccess: false };
        }

        return { isSuccess: true };
    } catch (e) {
        console.error('Error', e);
        return { isSuccess: false, error: "Something went wrong!" };
    }
}

export const register = async (registerReqeust: RegisterRequest): Promise<Result> => {
    try {
        const response = await fetchWithTimeout(`${TUTORAPI}/account/register`, {
            method: "POST",
            body: JSON.stringify(registerReqeust),
            headers: {
                "Content-Type": "application/json",
            }
        });

        return interpret(response);
    } catch (e) {
        console.error(e, 'The registeration process failed');
        return { isSuccess: false, error: 'Something went wrong!' };
    }
}

const mapTokenToUser = (token: string): User => {
    const decoded: Record<string, any> = jwtDecode(token);

    const id = decoded["http://schemas.xmlsoap.org/ws/2009/09/identity/claims/id"] ?? "";

    const email =
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ??
        decoded["email"] ??
        "";

    const subscriptionGroup = decoded["http://schemas.xmlsoap.org/ws/2009/09/identity/claims/subscriptionGroup"]

    // Convert all claims to { type, value } pairs
    const claims: Claim[] = Object.entries(decoded).map(([key, value]) => ({
        type: key,
        value: String(value),
    }));

    return { id, email, subscriptionGroup, claims };
}