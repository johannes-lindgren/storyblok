import {UserInfo} from "@src/types/user-info";
import {ISODateString} from "next-auth/core/types";

// We are augmenting the types, because we want to pass some extra data to the front-end client application, such as
// the access token, space id, roles.

declare module "next-auth/jwt" {
    interface JWT {
        name: string;
        sub: string;
        accessToken: string
        accessTokenExpires: number
        refreshToken: string
        userInfo: UserInfo
    }
}

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        accessToken: string
        // Server-side generated string that specifies when the token will expire
        expires: ISODateString
        // seconds until it expires from the time the session was fetched from the backend
        // i.e. not from the time that the token was issued.
        expiresInMs: number
        userInfo: UserInfo
    }

    interface User {
        id: string
        name: string
    }

    // interface Account {    /**
    //      * This value depends on the type of the provider being used to create the account.
    //      * - oauth: The OAuth account's id, returned from the `profile()` callback.
    //      * - email: The user's email address.
    //      * - credentials: `id` returned from the `authorize()` callback
    //      */
    //     providerAccountId: string;
    //     /** id of the user this account belongs to. */
    //     userId: string;
    //     /** id of the provider used for this account */
    //     provider: string;
    //     /** Provider's type for this account */
    //     type: ProviderType;
    //     expires_in: number
    //     access_token: string
    //     refresh_token: string
    // }

    // interface Profile extends UserInfo {
    // }
}

interface CustomAppSession {
    accessToken: string
    // Server-side generated string that specifies when the token will expire
    expires: ISODateString
    // seconds until it expires from the time the session was fetched from the backend
    // i.e. not from the time that the token was issued.
    expiresInMs: number
}

interface CustomAppUser {
    id: string
    name: string
}

interface CustomAppProfile extends UserInfo {
}

export {CustomAppProfile, CustomAppUser, CustomAppSession};