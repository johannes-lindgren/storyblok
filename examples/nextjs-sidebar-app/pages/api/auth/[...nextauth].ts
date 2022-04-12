import NextAuth, {CookieOption} from 'next-auth'
import {OAuthConfig, OAuthUserConfig} from 'next-auth/providers'
import {CookieSerializeOptions} from "cookie";
import {grantToken, UserInfo} from "@src/custom-app";
import {TokenSet, TokenSetParameters} from "openid-client";

const StoryblokProvider = (options: OAuthUserConfig<SbUserInfo>): OAuthConfig<SbUserInfo> => ({
    id: 'storyblok',
    name: 'Storyblok',
    type: 'oauth',
    version: '2.0',
    authorization: {
      url: "https://app.storyblok.com/oauth/authorize",
      params: {
        scope: "read_content write_content",
      },
    },
    token: {
        url: "https://app.storyblok.com/oauth/token",
        async request(context) {
            console.log('request')
            const client_secret = process.env.STORYBLOK_CLIENT_SECRET as string
            const client_id = process.env.STORYBLOK_CLIENT_ID as string
            const redirect_uri = process.env.STORYBLOK_CLIENT_REDIRECT_URI as string

            const tokenRes = await grantToken({
                code: context.params.code as string,
                client_secret,
                client_id,
                redirect_uri,
            })
            return { tokens: new TokenSet(tokenRes)}
        }
    },
    userinfo: 'https://app.storyblok.com/oauth/user_info',
    // profileUrl: "https://app.storyblok.com/oauth/user_info",
    async profile(profile: UserInfo) {
        return ({
            id: profile.user.id.toString(),
            name: profile.user.friendly_name,
            roles: profile.roles,
            space: profile.space,
        })
    },
    checks: ['state'],
    options,
})

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
            name: 'sb.next-auth.pkceCodeVerifier',
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
            session.accessToken = token.accessToken
            return session
        }
    },
    // callbacks: {
    //     async signIn({ user, account, profile, email, credentials }) {
    //         console.log('callback: signin')
    //         return true
    //     },
    //     async redirect({ url, baseUrl }) {
    //         console.log('callback: redirect')
    //         console.log({url})
    //         console.log({baseUrl})
    //         return baseUrl
    //     },
    //     async session({ session, user, token }) {
    //         console.log('callback: session')
    //         return session
    //     },
    //     async jwt({ token, user, account, profile, isNewUser }) {
    //         console.log('callback: token')
    //         return token
    //     }
    // }
})

// export default async function handler(
//     req: NextApiRequest,
//     res: NextApiResponse
// ) {
//     // console.log('query', req.query)
//     // if(req.url?.startsWith('/api/auth/signin/storyblok') && req.method?.toUpperCase() === "GET"){
//     //     console.log('signing in');
//     //     const csrfToken = await getCsrfToken()
//     //     if(!csrfToken){
//     //         console.log('Failed to fetch/issue csrf token')
//     //         res.status(500).end()
//     //         return
//     //     }
//     //     console.log('Fetched csrf token')
//     //     const headers = {
//     //         'Content-Type': 'application/x-www-form-urlencoded'
//     //     }
//     //     const body = new URLSearchParams({
//     //         csrfToken,
//     //     }).toString()
//     //
//     //     console.log('fetching...')
//     //     const response = await fetch(`http://localhost:3000/api/auth/signin/storyblok`, {
//     //         method: 'POST',
//     //         headers,
//     //         body,
//     //     })
//     //     console.log('fetchhed!')
//     //
//     //     console.log(response.status)
//     //     const json = await  response.text()
//     //     console.log({json})
//     //
//     //     // req.method = 'POST'
//     //     // req.query.csrf = csrfToken
//     // }
//     return NextAuth({
//         // Configure one or more authentication providers
//         // TODO secret for signing jwt tokens (csrf tokens)
//         providers: [
//             StoryblokProvider({
//                 clientId: process.env.STORYBLOK_CLIENT_ID as string,
//                 clientSecret: process.env.STORYBLOK_CLIENT_SECRET as string,
//             }),
//         ],
//         callbacks: {
//             async signIn({ user, account, profile, email, credentials }) {
//                 console.log('callback: signin')
//                 return true
//             },
//             async redirect({ url, baseUrl }) {
//                 console.log('callback: redirect')
//                 console.log({url})
//                 console.log({baseUrl})
//                 return baseUrl
//             },
//             async session({ session, user, token }) {
//                 console.log('callback: session')
//                 return session
//             },
//             async jwt({ token, user, account, profile, isNewUser }) {
//                 console.log('callback: token')
//                 return token
//             }
//         }
//     })(req, res)
// }