import {Space, Story} from "@johannes-lindgren/storyblok-js";
import throttled from './promise-throttle'
import {stripLeadingSlash} from "@src/storyblok-js/utils/url-utils";

const contentManagementApiUrl = 'https://mapi.storyblok.com/v1'

export class ContentManagementClient {

    // TODO need to replace the client, because the storyblok-js-client doesn't let us update the oauth tokens
    private fetch: typeof fetch
    private _accessToken: string

    constructor(accessToken: string) {
        // TODO remove console.log
        console.log('Init new ContentManagementClient')

        this.fetch = throttled((r, i) => fetch(r,i), 3, 1000); // TODO read dynamically via settings
        this._accessToken = accessToken
    }

    private async get<T>(relativeUrl: string): Promise<T> {
        const response = await this.fetch(`${contentManagementApiUrl}/${stripLeadingSlash(relativeUrl)}`, {
            method: 'GET',
            headers: {
                // NOTE for personal oauth access tokens, 'Bearer ' should be omitted.
                // But for custom apps, it must be included.
                'Authorization': `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json',
            },
        })
        if(!response.ok){
            throw new Error(response.statusText)
        }
        return await response.json() as unknown as T
    }

    private post(relativeUrl: string, body: any) {
        return this.fetch(`${contentManagementApiUrl}/${stripLeadingSlash(relativeUrl)}`, {
            method: 'POST',
            headers: {
                // NOTE for personal oauth access tokens, 'Bearer ' should be omitted.
                // But for custom apps, it must be included.
                'Authorization': `Bearer ${this.accessToken}`
            },
            body: JSON.stringify(body),
        })
    }

    setAccessToken(accessToken: string) {
        this._accessToken = accessToken
    }

    private get accessToken(): string {
        return this._accessToken
    }
    //
    // // // TODO type
    // async getSpace(spaceId: number | string): Promise<Space | undefined> {
    //     return this.client
    //         .get(`spaces/${spaceId}`)
    //         .then(res => {
    //             return res.data.space as unknown as Space
    //         })
    // }

    async getStories(spaceId: number | string): Promise<Story[]> {
        return this
            .get(`spaces/${spaceId}/stories`)
            .then(res => res.stories as unknown as Story[])
    }
}



//    TODO implement
// These are the available endpoints for custom app access tokens
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