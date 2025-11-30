import { User } from "@/src/types/account/user"
import { Claim } from "@/src/types/account/claim"
import { LoginRequest } from "@/src/types/account/loginRequest"
import { RegisterRequest } from "@/src/types/account/registerRequest"
import { TUTORAPI } from "@/src/constants/addresses";
import { LoginResponse } from "@/src/types/account/loginResponse"
import { jwtDecode } from "jwt-decode";
import { TutorApiLoginResponse } from "@/src/types/account/tutoApiLoginResponse";

export const login = async (loginRequest: LoginRequest): Promise<LoginResponse> => {
    try {
        const response = await fetch(`${TUTORAPI}/account/login`, {
            method: "POST",
            body: JSON.stringify(loginRequest),
            headers: {
                "Content-Type": "application/json",
            }
        });

        console.log('Response', response.status);
        const responseText = await response.text();
        console.log('Response Text', responseText);
        const loginResponse = JSON.parse(responseText) as TutorApiLoginResponse;
        const user = mapTokenToUser(loginResponse.accessToken);

        return {user, accessToken: loginResponse.accessToken}
    } catch (e) {
        console.log('Error', e);
        return { user: undefined, accessToken: undefined};
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