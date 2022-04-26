import {CallbacksOptions, NextAuthOptions} from "next-auth";
import {CookieOption} from "next-auth/core/types";
import {JWT} from "next-auth/jwt";
import {sendTokenRequest} from "@src/api/storyblok-oauth-api";
import {StoryblokAuthProvider} from "@src/api/storyblok-auth-provider";
import {StoryblokAccount} from "@src/types/storyblok-account";
import {CustomAppProfile} from "@src/types";
import {refreshToken} from "@src/api/refresh-token";

// The client should consider the token expired before it actually is, so that it can refresh the token well-ahead of time.
const CLIENT_MARGIN_MS = 60 * 1000
// The API should have the greates margin. i.e. the API should consider the token expired before the client does
const API_MARGIN_MS = 2* 60 * 1000

const makeCookieOption = (name: string): CookieOption => ({
    name,
    options: {
        path: '/',
        secure: true,
        sameSite: 'none', // Needed since custom apps are embedded in iframes
        httpOnly: true, // The refresh token must not be accessible via client-side javascript
    }
})

type AppAuthOptions = {
    jwtSecret?: string
    clientId?: string
    clientSecret?: string
}

const readEnvironmentVariable = (variableName: string): string => {
    const v = process.env[variableName]
    if(typeof v === 'undefined'){
        throw new Error(`The environment variable '${variableName}' is required but not defined`)
    }
    return v
}

const makeAppAuthOptions = (options?: AppAuthOptions): NextAuthOptions => {
    const {
        jwtSecret = readEnvironmentVariable('STORYBLOK_JWT_SECRET'),
        clientSecret = readEnvironmentVariable('STORYBLOK_CLIENT_SECRET'),
        clientId = readEnvironmentVariable('STORYBLOK_CLIENT_ID')
    } = options ?? {}

    if(!process.env.NEXTAUTH_URL){
        throw new Error("The en environmental variable NEXTAUTH_URL is required but not defined")
    }

    return ({
        secret: jwtSecret,
        // Need to use non-default settings since custom apps are embedded
        cookies: {
            sessionToken: makeCookieOption('sb.next-auth.sessionToken'),
            pkceCodeVerifier: makeCookieOption('sb.next-auth.pkce-code-verifier'),
            callbackUrl: makeCookieOption('sb.next-auth.callback-url'),
            state: makeCookieOption('sb.next-auth.state'),
            csrfToken: makeCookieOption('sb.next-auth.csrf-token')
        },
        providers: [
            StoryblokAuthProvider({
                clientId,
                clientSecret,
            }),
        ],
        callbacks: makeCallbacksForAutoRefresh({
            clientId,
            clientSecret,
            jwtSecret,
        }) as CallbacksOptions,
        theme: {
            colorScheme: 'light',
            brandColor: '#00b3b0',
        },
        // pages: // TODO disable login pages
    })
}

const makeCallbacksForAutoRefresh = ({
                           clientId,
                           clientSecret
                       }: Required<AppAuthOptions>): Partial<CallbacksOptions<CustomAppProfile, StoryblokAccount>> => ({
    // Here are a few timestamps
    // 1. accessTokenIssued - The jwt hook will not refresh the token. The client is not advised to refresh yet.
    // 2. expiresByAPI - The jwt hook will refresh the token, but the client has not been advised to do so yet.
    // 3. expiresByClient - The jwt hook will refresh the token, the client will be asked to perform the request at this point.
    // 4. expiresByStoryblok - The jwt hook will refresh the token. The token is expired by storyblok. The client should have already refreshed the token.
    async jwt({token, account, user, profile}): Promise<JWT> {
        // Check for initial sign in
        if (account && user && profile) {
            // IMPORTANT: token will not be an actual token! But it will be a User! Bug in next-auth?
            // To get the expire_in, we must refetch the token

            const tokenRefreshResponse = await sendTokenRequest({
                grant_type: 'refresh_token',
                refresh_token: account.refresh_token,
                client_id: clientId,
                client_secret: clientSecret,
            })

            return {
                name: profile.user.friendly_name,
                sub: profile.user.id.toString(),
                accessToken: tokenRefreshResponse.access_token,
                accessTokenExpires: Date.now() + tokenRefreshResponse.expires_in * 1000,
                refreshToken: account.refresh_token,
                userInfo: profile,
            }
        }

        if (!isExpiredByAPI(token)) {
            console.log('The token is not considered expired, since it still has ', timeTo(getExpiresByStoryblok(token)) / 1000, 's to live by storyblok')
            // Return previous token if the access token has not expired yet
            return token
        }

        console.log('Refreshing token. It still has', timeTo(getExpiresByStoryblok(token)) / 1000, 's to live by storyblok')
        // Access token has expired, try to update it
        return await refreshToken(token, clientId, clientSecret)
    },

    // Returns the Session object that is accessible by the frontend app
    async session({token}) {
        // Send properties to the client, like an access_token from a provider.
        return {
            userInfo: token.userInfo,
            accessToken: token.accessToken,
            // Underestimate the longevity of the token, so that it will refresh token well before it actually expires
            refreshInMs: timeTo(getExpiresByClient(token)),
            expires: new Date(getExpiresByClient(token)).toISOString(),
        }
    },
})

// Whether this api considers the token expired
const isExpiredByAPI = (token: JWT): boolean => 0 > timeTo(getExpiresByAPI(token))

// When Storyblok expires the token
const getExpiresByStoryblok = (token: JWT): number => token.accessTokenExpires

// When the client should consider the token expired; adds a bit of margin to the real expiration time
const getExpiresByClient = (token: JWT): number => getExpiresByStoryblok(token) - CLIENT_MARGIN_MS

// When this API will consider the token expired; adds a bit of margin to the real expiration time
const getExpiresByAPI = (token: JWT): number => getExpiresByStoryblok(token) - API_MARGIN_MS

// Counts the ms until a timestamp occurs
const timeTo = (timestampMs: number): number => timestampMs - Date.now()

export {makeAppAuthOptions}