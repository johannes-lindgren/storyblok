import StoryblokClient from "storyblok-js-client";
import {Space, Story} from "@johannes-lindgren/storyblok-js";

// TODO remove
const tmpDevSpace = 152949

export class ContentManagementClient {

    private client: StoryblokClient

    constructor(accessToken: string) {
        console.log('Init new ContentManagementClient') // TODO remove
        this.client = new StoryblokClient({
            oauthToken: 'Bearer ' + accessToken,
            cache: {
                clear: "auto",
                type: "memory",
            }
        })
    }

    setToken(accessToken: string){
        this.client.setToken('Bearer ' + accessToken)
    }

    // // TODO type
    async getSpace(): Promise<Space | undefined> {
        return this.client
            .get(`spaces/${tmpDevSpace}`)
            .then(res => {
                return res.data.space as unknown as Space
            })
    }

    async getStories(): Promise<Story[]> {
        return this.client
            .get(`spaces/${tmpDevSpace}/stories`)
            .then(res => res.data.stories as unknown as Story[])
    }
//    TODO implement
// Stories
// Components
// Components Groups
// Assets
// Asset Folders
// Datasources
// Datasource Entries
// Workflow Stage
// Workflow Stage Changes
// Releases

    // Some of the other endpoints might not work for custom apps
}