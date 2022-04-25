import {CallbacksOptions} from "next-auth";
import {CookieOption} from "next-auth/core/types";
import {JWT} from "next-auth/jwt";
import {refreshToken, sendTokenRequest} from "@src/api/storyblok-oauth-api";
import {StoryblokAuthProvider} from "@src/api/storyblok-auth-provider";
import {StoryblokAccount} from "@src/types/storyblok-account";
import {CustomAppProfile} from "@src/types";

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

type StoryblokAuthOptions = {
    jwtSecret?: string
    clientId?: string
    clientSecret?: string
}

const makeAppAuthOptions = (options?: StoryblokAuthOptions) => {
    const {
        jwtSecret = process.env.STORYBLOK_JWT_SECRET,
        clientSecret = process.env.STORYBLOK_CLIENT_SECRET,
        clientId = process.env.STORYBLOK_CLIENT_ID
    } = options ?? {}

    if (!jwtSecret || !clientSecret || !clientId) {
        console.error('At least one of the following environmental variables has not been set.')
        console.error('STORYBLOK_JWT_SECRET set:', !!jwtSecret)
        console.error('STORYBLOK_CLIENT_SECRET set:', !!clientSecret)
        console.error('STORYBLOK_CLIENT_ID set:', !!clientId)
        console.error('Alternatively, pass values from other environmental variables as options in the StoryblokAuth() function call.')
        throw new Error('The server environment is not set up correctly. Authentication will not function.')
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
        callbacks: makeCallbacks({
            clientId,
            clientSecret,
            jwtSecret,
        }) as CallbacksOptions,
        // pages: // TODO disable login pages
    })
}

const makeCallbacks = ({
                           clientId,
                           clientSecret
                       }: Required<StoryblokAuthOptions>): Partial<CallbacksOptions<CustomAppProfile, StoryblokAccount>> => ({
    // Here are a few timestamps
    // 1. accessTokenIssued
    // 2. The token will not be refreshed
    // 3. The token will be refreshed, but it's earlier than the stated expiration time
    // 4. The token will be refreshed, it's after the stated expiration time, but the token is still valid
    // 5. accessTokenExpires - The token is actually expired.
    async jwt({token, account, user, profile}): Promise<JWT> {
        if (isInitialJwtCallback(account)) {
            // Initial sign in

            // NOTE: token will not be an actual token! But it will be a User! Bug in next-auth?
            // To get the expire_in, we must refetch the token

            const tokenRefreshResponse = await sendTokenRequest({
                grant_type: 'refresh_token',
                refresh_token: account.refresh_token,
                client_id: clientId,
                client_secret: clientSecret,
            })
            if (!user) {
                throw new Error("The user is missing; this must be configured in the provider.")
            }
            if (!profile) {
                throw new Error("The profile is missing; this must be configured in the provider.")
            }

            return {
                email: undefined,
                name: profile.user.friendly_name,
                sub: profile.user.id.toString(),
                accessToken: tokenRefreshResponse.access_token,
                accessTokenExpires: Date.now() + tokenRefreshResponse.expires_in * 1000,
                refreshToken: account.refresh_token,
                user: user,
                roles: profile.roles,
                space: profile.space
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
            user: token.user,
            roles: token.roles,
            space: token.space,
            accessToken: token.accessToken,
            expiresInMs: timeTo(getExpiresByClient(token)), // Lie to client, so that it will refresh token well before it actually expires
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

// Whether this is the jwt callback after a sign in
const isInitialJwtCallback = (account: StoryblokAccount | undefined): account is StoryblokAccount => typeof account !== 'undefined'

export {makeAppAuthOptions}