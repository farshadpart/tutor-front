export type TokenHolder = {
    accessToken: AccessTokenHolder;
    refreshToken: RefreshTokenHolder; 
}

export type AccessTokenHolder = {
    token: string;
    expiration: Date;
}

export type RefreshTokenHolder = {
    token: string;
    expiration: Date;
}