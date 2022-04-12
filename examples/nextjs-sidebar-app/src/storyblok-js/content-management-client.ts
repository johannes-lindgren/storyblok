import StoryblokClient from "storyblok-js-client";
import {Space} from "@johannes-lindgren/storyblok-js";

export class ContentManagementClient {

    client: StoryblokClient

    constructor(accessToken: string) {
        this.client = new StoryblokClient({
            accessToken: accessToken,
            cache: {
                clear: "auto",
                type: "memory",
            }
        })
    }

    setToken(token: string){
        this.client.setToken(token)
    }

    // TODO type
    async getSpace(id: number | string): Promise<object | undefined> {
        return this.client
            .get(`spaces/${id}`)
            .then(res => {
                return res.data.space as unknown as Space
            })
    }
//    TODO implement
//    Stories
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