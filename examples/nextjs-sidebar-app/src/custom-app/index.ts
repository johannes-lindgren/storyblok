import {GetServerSidePropsContext, NextApiResponse} from "next";
import cookie from "cookie";

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
}
export type TokenRefreshResponse = Omit<TokenGrantResponse, 'refresh_token'>

type TokenGrantRequest = {
    code: string
    client_secret: string
    client_id: string
}

type TokenRefreshRequest = {
    refresh_token: string
    client_secret: string
    client_id: string
}
const tokenRequest = async <T extends 'authorization_code' | 'refresh_token', >(grant_type: T, requestData: T extends 'authorization_code' ? TokenGrantRequest : TokenRefreshRequest): Promise<T extends 'authorization_code' ? TokenGrantResponse : TokenRefreshResponse> => {
    const body = new URLSearchParams({
        grant_type,
        ...requestData,
    }).toString()

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

    return await response.json() as unknown as (T extends 'authorization_code' ? TokenGrantResponse : TokenRefreshResponse)
}

export const refreshToken = (props: TokenRefreshRequest) => tokenRequest('refresh_token', props)
export const grantToken = (props: TokenGrantRequest) => tokenRequest('authorization_code', props)

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
export const getStoryblokSession = (context: GetServerSidePropsContext) => getStoryblokSessionFromCookie(context.req.headers.cookie ?? '')

export function setStoryblokSessionCookie(
    res: NextApiResponse,
    session: StoryblokSession,
) {
    setCookies(res, {
        storyblokSession: JSON.stringify(session)
    })
}

function setCookies(
    res: NextApiResponse,
    // expiresIn: number,
    cookies: Record<string, string>
) {
    res.setHeader('Set-Cookie', Object.entries(cookies).map(e => (
        cookie.serialize(e[0], e[1], {
            path: '/',
            // maxAge: expiresIn,
            httpOnly: false,
            secure: true,
            sameSite: 'none',
        })
    )));
}