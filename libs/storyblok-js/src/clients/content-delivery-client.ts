import StoryblokClient, {StoryParams} from "storyblok-js-client";
import {Space} from "../space";
import {Story} from "../story";
import {Links} from "../link";

// TODO remove storyblok-js-client as a dependency.
// Use throttle.ts for limiting the number of requests per second
// Implement a caching mechanism, corresponding to the storyblok-js-client
class ContentDeliveryClient {
    space?: Space
    client: StoryblokClient
    _cacheInvalidationParam?: number

    constructor(accessToken: string,  endpoint?: string) {
        this.client = new StoryblokClient({
            accessToken: accessToken,
            cache: {
                clear: "auto",
                type: "memory",
            },
        }, endpoint)
    }

    async getSpace(): Promise<Space | undefined> {
        return this.client
            .get(`cdn/spaces/me/`)
            .then(res => {
                return res.data.space as unknown as Space
            })
            .catch(catch404)
    }

    async getStory(slugsOrId: string[] | string, options?: GetStoryOptions): Promise<Story | undefined> {
        const cv = await this.cacheInvalidationParam
        const {resolve_relations, ...options2} = options ?? {}
        const clientParams: StoryParams = {
            cv,
            ...options2,
            resolve_relations: resolve_relations?.join(','),
        }
        return (
            this.client
                .get(`cdn/stories/${slugsToStr(slugsOrId)}`, clientParams)
                .then(res => res.data.story as unknown as Story)
                .catch(catch404)
        )
    }

    async getLinks(options?: GetLinksOptions): Promise<Links> {
        const cv = await this.cacheInvalidationParam
        const {starts_with, ...options2} = options ?? {}
        const clientParams: LinksParams = {
            cv,
            ...options2,
            starts_with: starts_with && slugsToStr(starts_with)
        }
        return (
            this.client
                .get(`cdn/links`, clientParams)
                .then(res => res.data.links as unknown as Links)
        )
    }

    public async invalidateCache(): Promise<number> {
        const space = await this.getSpace()
        const cv = space?.id ?? Date.now()
        this._cacheInvalidationParam = cv
        return cv
    }

    public get cacheInvalidationParam(): Promise<number> {
        if(this._cacheInvalidationParam !== undefined){
            return Promise.resolve(this._cacheInvalidationParam)
        }
        return this.invalidateCache()
    }
}

type Version = 'published' | 'draft'

type GetStoryOptions = Omit<StoryParams, 'resolve_relations' | 'cv'> & {
    resolve_relations?: string[]
}

type GetLinksOptions = Omit<LinksParams, 'starts_with' | 'cv'> & {
    starts_with?: string[] | string
}

// Options passed to storyblok-js-client
type LinksParams = {
    starts_with?: string
    version?: Version
    paginated?: 1 | undefined
    cv?: number
}

// Utility functions

const slugsToStr = (slugs: string[] | string): string => typeof slugs === 'string' ? slugs : slugs.join('/')

const catch404 = (error: any) => {
    if (error.response?.status === 404) {
        return undefined
    } else {
        throw new Error('Request failed, and the response code was not 404. See log for more details.')
    }
}

export {ContentDeliveryClient, GetLinksOptions, GetStoryOptions}