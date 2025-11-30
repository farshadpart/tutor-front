import { Claim } from "@/src/types/account/claim"

export interface User {
    id: string,
    email: string,
    subscriptionGroup?: string,
    claims: Claim[]
}