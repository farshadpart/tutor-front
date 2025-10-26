import { User } from "../../hooks/useAuthStore"

export interface LoginResponse {
    user?: User
    accessToken?: string
}