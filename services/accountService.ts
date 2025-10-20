import { User, Claim, LoginRequest } from "../hooks/useAuthStore"
import { RegisterRequest } from "../interfaces/account/registerRequest"
import { TUTORAPI } from "./constants";
import { LoginResponse } from "../interfaces/account/loginResponse"
import { jwtDecode } from "jwt-decode";

export const login = async (loginRequest: LoginRequest): Promise<User | undefined> => {
    try {
        const response = await fetch(`${TUTORAPI}/account/login`, {
            method: "POST",
            body: JSON.stringify(loginRequest),
            headers: {
                "Content-Type": "application/json",
            }
        });

        const loginResponse = JSON.parse(await response.text()) as LoginResponse;
        return mapTokenToUser(loginResponse.accessToken);
    } catch (e) {
        console.log('Error', e);
        return undefined;
    }
}

export const logout = (email: string) : boolean => {
    return true;
}

export const register = async (registerReqeust: RegisterRequest): Promise<boolean> => {
    try {
        const response = await fetch(`${TUTORAPI}/account/register`, {
            method: "POST",
            body: JSON.stringify(registerReqeust),
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (response.status === 200) {
            return true;
        }

        return false;
    } catch (e) {
        console.log('Error', e);
        return false;
    }
}

const mapTokenToUser = (token: string): User => {
    const decoded: Record<string, any> = jwtDecode(token);

    // Extract email from the common claim key
    const email =
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ??
        decoded["email"] ??
        "";

    // Convert all claims to { type, value } pairs
    const claims: Claim[] = Object.entries(decoded).map(([key, value]) => ({
        type: key,
        value: String(value),
    }));

    return { email, claims };
}