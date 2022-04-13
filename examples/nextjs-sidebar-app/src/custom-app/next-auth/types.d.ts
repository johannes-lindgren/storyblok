import {ISODateString} from "next-auth/core/types";

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: User,
        accessToken: string
        expires: ISODateString
    }
}

type User = {
    name: string
}