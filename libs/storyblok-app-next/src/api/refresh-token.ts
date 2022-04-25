import {JWT} from "next-auth/jwt";
import {sendTokenRequest} from "@src/api/storyblok-oauth-api";

// NOTE: to refresh a token, we need to provide a clientId and clientSecret, even though this is not required by the
// standard OAuth 2.0 specification.
const refreshToken = async (oldToken: JWT, clientId: string, clientSecret: string): Promise<JWT> => {
    const res = await sendTokenRequest({
        grant_type: 'refresh_token',
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: oldToken.refreshToken,
    })

    const expires_in = res.expires_in

    return {
        ...oldToken,
        accessToken: res.access_token,
        accessTokenExpires: Date.now() + expires_in * 1000,
    }
}
export {refreshToken};