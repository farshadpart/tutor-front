import { User, LoginRequest } from "../hooks/useAuthStore"
import { RegisterRequest } from "../interfaces/account/registerRequest"

export const login = (loginRequest: LoginRequest): User | undefined => {
    return { email: "dastekhar@login.com", claims: [] };
}

export const logout = (email: string) : boolean => {
    return true;
}

export const register = (registerReqeust: RegisterRequest): User | undefined => {
    return { email: "dastekhar@register.com", claims: [] };
}