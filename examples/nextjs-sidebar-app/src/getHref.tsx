import {LinkData} from "@johannes-lindgren/storyblok-js";

export const getHref = (link: LinkData): string => {
    switch (link.linktype) {
        case "asset":
        case "url":
            return link.cached_url
        case "story":
            return '/' + link.cached_url
        case "email":
            return `mailto:${link.email}`
        default:
            throw new Error(`Unknown link type '${link.linkType}'`)
    }
}