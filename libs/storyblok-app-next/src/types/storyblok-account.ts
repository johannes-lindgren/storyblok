import {DefaultAccount} from "next-auth/core/types";

interface StoryblokAccount extends DefaultAccount {
    access_token: string
    refresh_token: string
}

export {StoryblokAccount};