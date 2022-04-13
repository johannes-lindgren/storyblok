import {OAuthConfig, OAuthUserConfig} from "next-auth/providers";
import {requestToken, UserInfo} from "@src/custom-app";
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
            console.log(context.provider)

            // NOTE: Storyblok implementation does not adhere to the standard specified in https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.3
            // An additional parameter 'client_secret' is required
            const tokenRes = await requestToken({
                grant_type: 'authorization_code',
                code: context.params.code as string,
                redirect_uri: context.provider.callbackUrl,
                client_id: context.provider.clientId as string,
                client_secret: context.provider.clientSecret as string,
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