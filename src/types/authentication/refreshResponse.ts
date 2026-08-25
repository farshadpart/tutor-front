import { TokenHolder } from "@/src/types/authentication/tokenHolders";
import { User } from "@/src/types/authentication/user";

export interface RefreshResponse {
    user?: User;
    tokenHolder?: TokenHolder;
}