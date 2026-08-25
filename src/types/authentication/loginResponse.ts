import { User } from "@/src/types/authentication/user"
import { TokenHolder } from "./tokenHolders"

export interface LoginResponse {
    user?: User
    tokenHolder?: TokenHolder
}