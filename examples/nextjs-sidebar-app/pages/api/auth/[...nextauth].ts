import {StoryblokAuth} from "@src/custom-app/auth-api/storyblok-auth";

export default StoryblokAuth({
    clientId: process.env.STORYBLOK_CLIENT_ID,
    clientSecret: process.env.STORYBLOK_CLIENT_SECRET,
    jwtSecret: process.env.STORYBLOK_JWT_SECRET,
})