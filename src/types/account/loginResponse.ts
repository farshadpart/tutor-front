import { User } from "@/src/types/account/user"
import { TokenHolder } from "./tokenHolders"

export interface LoginResponse {
    user?: User
    tokenHolder?: TokenHolder
}