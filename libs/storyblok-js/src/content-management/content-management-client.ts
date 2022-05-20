import throttle from '../utils/throttle'
import {noLeadingSlash} from "../utils/url-utils";
import {Story} from "../story";
import {Component} from "./model/component";

const contentManagementApiUrl = 'https://mapi.storyblok.com/v1'

export class ContentManagementClient {

    // TODO need to replace the client, because the storyblok-js-client doesn't let us update the oauth tokens
    private fetch: typeof fetch
    private _accessToken: string
    private _spaceId: string | number

    constructor(accessToken: string, spaceId: string | number) {
        // TODO remove console.log
        console.log('Init new ContentManagementClient')

        // TODO read limits dynamically via settings
        // Need to wrap fetch in an arrow function, as fetch is part of the window object
        this.fetch = throttle((r: RequestInfo, i: RequestInit | undefined) => fetch(r,i), 3, 1000);
        this._accessToken = accessToken
        this._spaceId = spaceId
    }

    // Properties Getters and Setters

    setAccessToken(accessToken: string) {
        this._accessToken = accessToken
    }

    private get accessToken(): string {
        return this._accessToken
    }

    set spaceId(spaceId) {
        this._spaceId = spaceId
    }

    get spaceId(): string | number {
        return this._spaceId
    }

    // Helpers

    private async get(relativeUrl: string) {
        const response = await this.fetch(`${contentManagementApiUrl}/${noLeadingSlash(relativeUrl)}`, {
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
        return await response.json()
    }

    private getMultiple<T>(type: string): Promise<T[]> {
        return this
            .get(`spaces/${this.spaceId}/${type}`)
            .then(res => res[type] as unknown as T[])
    }

    private getSingle<T>(type: string, id: string | number): Promise<T> {
        return this
            .get(`spaces/${this.spaceId}/${type}/${id}`)
            .then(res => res[type] as unknown as T)
    }

    // API

    // private async post(relativeUrl: string, body: any) {
    //     return this.fetch(`${contentManagementApiUrl}/${stripLeadingSlash(relativeUrl)}`, {
    //         method: 'POST',
    //         headers: {
    //             // NOTE for personal oauth access tokens, 'Bearer ' should be omitted.
    //             // But for custom apps, it must be included.
    //             'Authorization': `Bearer ${this.accessToken}`
    //         },
    //         body: JSON.stringify(body),
    //     })
    // }


    getStories(): Promise<Omit<Story, 'content'>[]> {
        return this.getMultiple('stories')
    }

    getStory(id: string | number): Promise<Story> {
        return this
            .get(`spaces/${this.spaceId}/stories/${id}`)
            .then(res => res.story as unknown as Story)
    }

    getComponents(): Promise<Component[]> {
        return this.getMultiple('components')
    }

    getComponent(id: string | number): Promise<Component> {
        return this.getSingle('components', id)
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