import {OAuthConfig, OAuthUserConfig} from "next-auth/providers";
import {grantToken, UserInfo} from "@src/custom-app";
import {TokenSet} from "openid-client";

export const StoryblokProvider = (options: OAuthUserConfig<UserInfo>): OAuthConfig<UserInfo> => ({
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
            return {tokens: new TokenSet(tokenRes)}
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