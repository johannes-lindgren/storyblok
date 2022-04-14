import cookie from "cookie";
import {JWT} from "next-auth";

export type StoryblokSession = TokenGrantResponse & UserInfo

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
export type UserInfo = {
    user: User,
    space: Space,
    roles: Role[],
}
export type TokenGrantResponse = {
    access_token: string
    refresh_token: string
    token_type: string
    expires_in: number
    error?: string
}

export type TokenRefreshResponse = Omit<TokenGrantResponse, 'refresh_token'>

type TokenGrantRequest = {
    grant_type: 'authorization_code',
    code: string
    client_secret: string
    client_id: string
    redirect_uri: string
}

type TokenRefreshRequest = {
    grant_type: 'refresh_token',
    refresh_token: string
    client_secret: string
    client_id: string
}

const sendTokenRequest = async <T extends TokenGrantRequest | TokenRefreshRequest,>(requestData: T): Promise<T extends TokenGrantRequest ? TokenGrantResponse : TokenRefreshResponse> => {
    const body = new URLSearchParams(requestData).toString()

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    const response = await fetch(`https://app.storyblok.com/oauth/token`, {
        method: 'POST',
        headers,
        body,
    })

    if (response.status !== 200) {
        console.error('failed to fetch token', response);
        throw new Error('Unauthorized')
    }

    return await response.json() as unknown as (T extends TokenGrantRequest ? TokenGrantResponse : TokenRefreshResponse)
}

export const refreshToken2 = async (token: JWT): Promise<JWT> => {
    const res = await sendTokenRequest({
        grant_type: 'refresh_token',
        client_id: process.env.STORYBLOK_CLIENT_ID as string, // TODO should not be hard coded, ideally
        client_secret: process.env.STORYBLOK_CLIENT_SECRET as string,
        refresh_token: token.refreshToken,
    })

    // TODO only for dev
    const expires_in = res.expires_in
    console.log('Got expires_in', expires_in)

    return {
        ...token,
        accessToken: res.access_token,
        expiresIn: expires_in,
        accessTokenExpires: Date.now() + expires_in * 1000,
    }
}

export const refreshToken = (props: TokenRefreshRequest) => sendTokenRequest(props)
export const requestToken = (props: TokenGrantRequest) => sendTokenRequest(props)

export const getUser = async (accessToken: string): Promise<UserInfo> => {
    const response = await fetch('https://api.storyblok.com/oauth/user_info', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
    })
    return response.json() as Promise<UserInfo>
}
export const getStoryblokSessionFromCookie = (c: string): StoryblokSession | undefined => {
    const storyblokSession = cookie.parse(c).storyblokSession
    if (!storyblokSession) {
        return undefined
    }
    return JSON.parse(storyblokSession)
}
