import {Story} from "storyblok-js-client";

export type LinkField = UrlLink | StoryLink

type UrlLink = {
    id: string
    url: string
    linktype: 'url'
    fieldtype: 'multilink'
    cached_url: string
}

type StoryLink = {
    id: string
    url: string
    linktype: 'story'
    fieldtype: 'multilink'
    cached_url: string
    story: Story
}