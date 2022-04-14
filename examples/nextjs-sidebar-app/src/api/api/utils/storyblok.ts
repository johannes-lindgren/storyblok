import StoryblokClient from "storyblok-js-client";


export const StoryblokManagementClient = (oauthToken: string) =>
  new StoryblokClient({
    oauthToken: `Bearer ${oauthToken}`,
  });

