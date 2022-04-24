import {DefaultAccount} from "next-auth/core/types";

interface StoryblokAccount extends DefaultAccount {
    expires_in: number
    access_token: string
    refresh_token: string
}

export {StoryblokAccount};