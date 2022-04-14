import {ISODateString} from "next-auth/core/types";
import {ProviderType} from "next-auth/providers";
import {UserInfo} from "@src/custom-app/next-auth-storyblok/storyblok-oauth-api";

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session extends UserInfo  {
        accessToken: string
        // Server-side generated string that specifies when the token will expire
        expires: ISODateString
        // seconds until it expires from the time it was set
        expiresIn: number
    }

    interface JWT {
        name?: string | null;
        email?: string | null;
        picture?: string | null;
        sub?: string;
        accessToken: string
        accessTokenExpires: number
        refreshToken: string
        expiresIn: number
        space: Space,
        user: User
        roles: Role[]
    }

    interface Account {    /**
         * This value depends on the type of the provider being used to create the account.
         * - oauth: The OAuth account's id, returned from the `profile()` callback.
         * - email: The user's email address.
         * - credentials: `id` returned from the `authorize()` callback
         */
        providerAccountId: string;
        /** id of the user this account belongs to. */
        userId: string;
        /** id of the provider used for this account */
        provider: string;
        /** Provider's type for this account */
        type: ProviderType;
        expires_in: number
        access_token: string
        refresh_token: string
    }

    interface Profile extends UserInfo {
    }

    interface User {
        id: string;
        name: string;
    }
}

type Space = {
    id: number
    name: string
}

type Role = {
    name: string
}