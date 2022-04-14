import {StoryblokAuth} from "@src/storyblok-next-sidebar-app";

export default StoryblokAuth({
    clientId: process.env.STORYBLOK_CLIENT_ID,
    clientSecret: process.env.STORYBLOK_CLIENT_SECRET,
    jwtSecret: process.env.STORYBLOK_JWT_SECRET,
})