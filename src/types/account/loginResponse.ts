import { User } from "@/src/types/account/user"

export interface LoginResponse {
    user?: User
    accessToken?: string
}