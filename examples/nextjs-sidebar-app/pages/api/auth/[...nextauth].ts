import {makeAppAuthOptions} from "@johannes-lindgren/storyblok-app-next/api";
import NextAuth from "next-auth";

export default NextAuth(
    makeAppAuthOptions({
        clientId: process.env.STORYBLOK_CLIENT_ID,
        clientSecret: process.env.STORYBLOK_CLIENT_SECRET,
        jwtSecret: process.env.STORYBLOK_JWT_SECRET,
    })
)