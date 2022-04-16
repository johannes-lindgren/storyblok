import {JWT} from "next-auth";

// The data that is returned from https://app.storyblok.com/oauth/user_info
export type UserInfo = {
    user: User,
    space: Space,
    roles: Role[],
}

export type User = {
    id: number
    friendly_name: string
}

export type Space = {
    id: number
    name: string
}

export type Role = {
    name: string
}

export type TokenRequestData = {
    access_token: string
    refresh_token: string
    token_type: string
    expires_in: number
    error?: string
}

type TokenRefreshResponse = Omit<TokenRequestData, 'refresh_token'>

type TokenRequestPayload = {
    grant_type: 'authorization_code',
    code: string
    client_secret: string
    client_id: string
    redirect_uri: string
}

type TokenRefreshPayload = {
    grant_type: 'refresh_token',
    refresh_token: string
    client_secret: string
    client_id: string
}

const sendTokenRequest = async <T extends TokenRequestPayload | TokenRefreshPayload,>(requestData: T): Promise<T extends TokenRequestPayload ? TokenRequestData : TokenRefreshResponse> => {
    const response = await fetch(`https://app.storyblok.com/oauth/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(requestData).toString(),
    })

    if (response.status !== 200) {
        console.error('failed to fetch token', response);
        throw new Error('Unauthorized')
    }

    return await response.json() as unknown as (T extends TokenRequestPayload ? TokenRequestData : TokenRefreshResponse)
}

export const refreshToken2 = async (token: JWT): Promise<JWT> => {
    const res = await sendTokenRequest({
        grant_type: 'refresh_token',
        client_id: process.env.STORYBLOK_CLIENT_ID as string, // TODO should not be hard coded, ideally
        client_secret: process.env.STORYBLOK_CLIENT_SECRET as string,
        refresh_token: token.refreshToken,
    })

    const expires_in = res.expires_in

    return {
        ...token,
        accessToken: res.access_token,
        expiresIn: expires_in,
        accessTokenExpires: Date.now() + expires_in * 1000,
    }
}

export const refreshToken = (props: TokenRefreshPayload) => sendTokenRequest(props)
export const requestToken = (props: TokenRequestPayload) => sendTokenRequest(props)
