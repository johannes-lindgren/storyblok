import {OAuthConfig, OAuthUserConfig} from "next-auth/providers";
import {requestToken, UserInfo} from "@src/custom-app/next-auth-storyblok/storyblok-oauth-api";
import {Profile} from "next-auth";

export const StoryblokAuthProvider = (options: OAuthUserConfig<Profile>): OAuthConfig<UserInfo> => ({
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
            // NOTE: Storyblok implementation does not adhere to the standard specified in https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.3
            // An additional parameter 'client_secret' is required
            if(!context.params.code || !context.provider.clientId || !context.provider.clientSecret){
                console.error('Code set', !!context.params.code)
                console.error('Code set', !!context.provider.clientId)
                console.error('Code set', !!context.provider.clientSecret)
                throw new Error("Cannot make a token request without all the required parameters: code, client_id, client_secret")
            }
            const tokenRequestData = await requestToken({
                grant_type: 'authorization_code',
                code: context.params.code,
                redirect_uri: context.provider.callbackUrl,
                client_id: context.provider.clientId,
                client_secret: context.provider.clientSecret,
            })
            return {
                tokens: tokenRequestData
            }
        }
    },
    userinfo: 'https://app.storyblok.com/oauth/user_info',
    async profile(profile) {
        return ({
            id: profile.user.id.toString(),
            name: profile.user.friendly_name,
        })
    },
    checks: ['state'],
    options,
})