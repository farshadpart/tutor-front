import { TUTORAPI } from "@/src/constants/addresses";
import { Claim } from "@/src/types/account/claim";
import { LoginRequest } from "@/src/types/account/loginRequest";
import { LoginResponse } from "@/src/types/account/loginResponse";
import { RegisterRequest } from "@/src/types/account/registerRequest";
import { TutorApiLoginResponse } from "@/src/types/account/tutoApiLoginResponse";
import { User } from "@/src/types/account/user";
import { jwtDecode } from "jwt-decode";
import { Result } from "@/src/types/common/result";
import { interpret } from "@/src/services/interpreter";

export const login = async (loginRequest: LoginRequest): Promise<Result<LoginResponse>> => {
    try {
        const response = await fetch(`${TUTORAPI}/account/login`, {
            method: "POST",
            body: JSON.stringify(loginRequest),
            headers: {
                "Content-Type": "application/json",
            }
        });

        const loginResponse = await interpret<TutorApiLoginResponse>(response);
        if (!loginResponse.isSuccess || loginResponse.data === undefined) {
            return loginResponse;
        }

        const user = mapTokenToUser(loginResponse.data.accessToken);
        return {
            isSuccess: true, data: { user, accessToken: loginResponse.data.accessToken }
        }
    } catch (e) {
        console.error('Error', e);
        return { isSuccess: false, error: "Something went wrong!"};
    }
}

export const logout = (email: string) : boolean => {
    return true;
}

export const register = async (registerReqeust: RegisterRequest): Promise<Result> => {
    try {
        const response = await fetch(`${TUTORAPI}/account/register`, {
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