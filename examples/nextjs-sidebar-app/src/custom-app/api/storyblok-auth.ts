import {NextApiHandler} from "next";
import NextAuth, {Session, JWT, User, Account, Profile} from "next-auth";
import {StoryblokAuthProvider} from "@src/custom-app/next-auth/storyblok-auth-provider";
import {CookieOption} from "next-auth/core/types";
import {refreshToken, refreshToken2, TokenGrantResponse} from "@src/custom-app";

const makeCookieOption = (name: string): CookieOption => ({
    name,
    options: {
        secure: true,
        sameSite: 'none',
        httpOnly: true,
        path: '/',
    }
})

type StoryblokAuthOptions = {
    jwtSecret?: string
    clientId?: string
    clientSecret?: string
}

export const StoryblokAuth: (options?: StoryblokAuthOptions) => NextApiHandler = (options) => {
    const {
        jwtSecret = process.env.STORYBLOK_JWT_SECRET,
        clientSecret = process.env.STORYBLOK_CLIENT_SECRET,
        clientId = process.env.STORYBLOK_CLIENT_ID
    } = options ?? {}

    if(!jwtSecret || !clientSecret || !clientId){
        console.error('At least one of the following environmental variables have not been set. Alternatively, pass the values from other variables as options to StoryblokAuth')
        console.error('STORYBLOK_JWT_SECRET set:', jwtSecret !== undefined)
        console.error('STORYBLOK_CLIENT_SECRET set:', clientSecret !== undefined)
        console.error('STORYBLOK_CLIENT_ID set:', clientId !== undefined)
        throw new Error('The server is not set up correctly')
    }

    return NextAuth({
        // Configure one or more authentication providers
        // TODO secret for signing jwt tokens (csrf tokens)
        useSecureCookies: false,
        secret: jwtSecret,
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
        callbacks: {
            async jwt({ token, account, user, profile }): Promise<JWT> {
                console.log('callback: jwt()')
                console.log({account})
                if (isInitialJwtCallback(account)) {
                    // Initial sign in
                    console.log('Initial sign in')
                    // NOTE: token will not be an actual token! But it will be a User! Bug in next-auth?
                    // To get the expire_in, we must refetch the token

                    const tokenRefreshResponse = await refreshToken({
                        grant_type: 'refresh_token',
                        refresh_token: account.refresh_token,
                        client_id: process.env.STORYBLOK_CLIENT_ID as string, // TODO should not be hard coded, ideally
                        client_secret: process.env.STORYBLOK_CLIENT_SECRET as string,
                    })

                    console.log({token})
                    console.log({account})
                    console.log({user})
                    console.log({profile})
                    const profileTmp = profile as Profile
                    return {
                        accessToken: tokenRefreshResponse.access_token,
                        expiresIn: tokenRefreshResponse.expires_in,
                        accessTokenExpires: Date.now() + tokenRefreshResponse.expires_in * 1000,
                        refreshToken: account.refresh_token,
                        user: user,
                        roles: profileTmp.roles,
                        space: profileTmp.space,
                    }
                }

                if (!hasTokenExpired(token)) {
                    // Return previous token if the access token has not expired yet
                    console.log('Has not expired yet')
                    console.log({token})
                    console.log('Expires at', token.accessTokenExpires)
                    return token
                }

                // // Persist the OAuth access_token to the token right after signin
                // return {
                //     ...token,
                //     accessToken: account?.access_token,
                // }

                console.log('Refreshing token')
                // Access token has expired, try to update it
                return await refreshToken2(token)
            },
            // Returns the object that is passed to the frontend

            async session({session, token}: {session: Session, token: JWT}): Promise<Session> {
                // Send properties to the client, like an access_token from a provider.
                console.log('callback: session()')
                console.log({session})
                console.log({token})
                return {
                    user: token.user,
                    roles: token.roles,
                    space: token.space,
                    accessToken: token.accessToken,
                    expiresIn: token.expiresIn,
                    expires: new Date(token.accessTokenExpires).toISOString(),
                }
            },
        },
    })
}

const hasTokenExpired = (token: JWT) => Date.now() > token.accessTokenExpires

// Whether this is the jwt callback after a sign in
const isInitialJwtCallback = (account: Account | undefined): account is Account => typeof account !== 'undefined'