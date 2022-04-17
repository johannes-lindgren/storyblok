// import {NextApiHandler} from "next";
import {CallbacksOptions} from "next-auth";
import {CookieOption} from "next-auth/core/types";
import {StoryblokAccount, StoryblokProfile} from "@src/types/module-augmentation";
import {JWT} from "next-auth/jwt";
import {refreshToken, sendTokenRequest} from "@src/api/storyblok-oauth-api";
import {StoryblokAuthProvider} from "@src/api/storyblok-auth-provider";

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

// TODO this would likely be the ideal way to do things. Instead of letting the library consumer pass
//  makeNextAuthOptions() to NextAuth(), Storyblok() auth could be used directly.
//  However, if we simply use the function below, the bundled code will utilize esm-browser instead of esm-node.
//  An error will be thrown when it is detected that window.crypto is not defined.
//  I haven't figured out to work around this issue. / Johannes
// const StoryblokAuth: (options?: StoryblokAuthOptions) => any = (options) => {
//     return NextAuth({})
// }

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
                       }: Required<StoryblokAuthOptions>): Partial<CallbacksOptions<StoryblokProfile, StoryblokAccount>> => ({
    async jwt({token, account, user, profile}): Promise<JWT> {
        if (isInitialJwtCallback(account)) {
            // Initial sign in

            // NOTE: token will not be an actual token! But it will be a User! Bug in next-auth?
            // To get the expire_in, we must refetch the token

            const tokenRefreshResponse = await sendTokenRequest({
                grant_type: 'refresh_token',
                refresh_token: account.refresh_token,
                client_id: clientId, // TODO should not be hard coded, ideally
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
                expiresIn: tokenRefreshResponse.expires_in,
                accessTokenExpires: Date.now() + tokenRefreshResponse.expires_in * 1000,
                refreshToken: account.refresh_token,
                user: user,
                roles: profile.roles,
                space: profile.space
            }
        }

        // TODO add some margin, so that we do not risk requesting a new session a few ms after it has expired
        if (!hasTokenExpired(token)) {
            // Return previous token if the access token has not expired yet
            return token
        }

        console.log('Refreshing token')
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
            expiresInMs: new Date(token.accessTokenExpires).getTime() - Date.now(),
            expires: new Date(token.accessTokenExpires).toISOString(),
        }
    },
})

const hasTokenExpired = (token: JWT) => Date.now() > token.accessTokenExpires

// Whether this is the jwt callback after a sign in
const isInitialJwtCallback = (account: StoryblokAccount | undefined): account is StoryblokAccount => typeof account !== 'undefined'

export {makeAppAuthOptions}