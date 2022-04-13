import {NextApiHandler} from "next";
import NextAuth from "next-auth";
import {StoryblokProvider} from "@src/custom-app/api/storyblok-provider";
import {CookieOption} from "next-auth/core/types";

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
            StoryblokProvider({
                clientId,
                clientSecret,
            }),
        ],
        callbacks: {
            async jwt({ token, account }) {
                // Persist the OAuth access_token to the token right after signin
                if (account) {
                    token.accessToken = account.access_token
                }
                return token
            },
            async session({ session, token, user }) {
                // Send properties to the client, like an access_token from a provider.
                // console.log('callback: session()')
                // console.log({session})
                // console.log({token})
                // console.log({user})
                return {
                    ...session,
                    accessToken: token.accessToken,
                }
            },
        },
    })
}