import NextAuth from 'next-auth'
import {CookieSerializeOptions} from "cookie";
import {StoryblokProvider} from "@src/custom-app/api/storyblok-provider";

const options: CookieSerializeOptions = {
    secure: true,
    sameSite: 'none',
    httpOnly: true,
    path: '/',
} as const

export default NextAuth({
    // Configure one or more authentication providers
    // TODO secret for signing jwt tokens (csrf tokens)
    useSecureCookies: false,
    secret: process.env.NEXTAUTH_SECRET,
    cookies: {
        sessionToken: {
            name: 'sb.next-auth.sessionToken',
            options,
        },
        pkceCodeVerifier:{
            name: 'sb.next-auth.pkce-code-verifier',
            options,
        },
        callbackUrl: {
            name: 'sb.next-auth.callback-url',
            options,
        },
        state: {
            name: 'sb.next-auth.state',
            options,
        },
        csrfToken: {
            name: 'sb.next-auth.csrf-token',
            options,
        }
    },
    providers: [
        StoryblokProvider({
            clientId: process.env.STORYBLOK_CLIENT_ID as string,
            clientSecret: process.env.STORYBLOK_CLIENT_SECRET as string,
        }),
    ],
    // callbacks: {
    //     async jwt({ token, account }) {
    //         // Persist the OAuth access_token to the token right after signin
    //         if (account) {
    //             token.accessToken = account.access_token
    //         }
    //         return token
    //     },
    //     async session({ session, token, user }) {
    //         // Send properties to the client, like an access_token from a provider.
    //         session.accessToken = token.accessToken
    //         return session
    //     }
    // },
})