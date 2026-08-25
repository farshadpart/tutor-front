import { Claim } from "@/src/types/authentication/claim"

export interface User {
    id: string,
    email: string,
    subscriptionGroup?: string,
    claims: Claim[]
}