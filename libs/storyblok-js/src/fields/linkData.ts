import {Story} from "../story";

type LinkData = UrlLinkData | StoryLinkData | EmailLinkData | AssetLinkData

type UrlLinkData = {
    id: string
    url: string
    linktype: 'url'
    fieldtype: 'multilink'
    cached_url: string
}

type StoryLinkData<D extends Record<string, unknown> = Record<string, unknown>> = {
    id: string
    url: string
    linktype: 'story'
    fieldtype: 'multilink'
    cached_url: string
    story?: Story<D>
}

type EmailLinkData = {
    id: string
    url: string
    email: string
    linktype: 'email'
    fieldtype: 'multilink'
    cached_url: string
}

type AssetLinkData = {
    id: string
    url: string
    linktype: 'asset'
    fieldtype: 'multilink'
    cached_url: string
}

export {LinkData, UrlLinkData, StoryLinkData, EmailLinkData, AssetLinkData}