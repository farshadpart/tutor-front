import { TokenHolder } from "@/src/types/account/tokenHolders";
import { User } from "@/src/types/account/user";

export interface RefreshResponse {
    user?: User;
    tokenHolder?: TokenHolder;
}