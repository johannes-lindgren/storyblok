import {ContentDeliveryClient} from "@johannes-lindgren/storyblok-js";
import {resolve_links, resolve_relations} from "@resume-builder/../components/dynamic-components";
import {Story as StoryData} from "@johannes-lindgren/storyblok-js/dist/cjs/story";
import {LayoutData} from "@resume-builder/../components/layout";

export type PageProps = {
    layoutStory: StoryData<LayoutData> | null
    story: StoryData
    previewToken: string | null
}

export type Options = {
    previewToken: string
    preview: boolean
    locale: string | undefined,
    defaultLocale: string | undefined,
}

export const getPageProps = async (
    slugs: string[],
    options: Options
): Promise<PageProps | undefined> => {
    const {previewToken, preview, locale, defaultLocale} = options
    if (!slugs) {
        return
    }
    // If not preview, we can still safely use the preview token on the backend.
    const client = new ContentDeliveryClient(previewToken)
    const language = locale === defaultLocale ? 'default' : locale
    const [story, layoutStory] = await Promise.all([
        client.getStory(slugs, {
            version: preview ? 'draft' : 'published',
            resolve_links,
            resolve_relations,
            language,
        }),
        client.getStory('layouts/default', {
            version: preview ? 'draft' : 'published',
            resolve_links,
            resolve_relations,
            language,
        })
    ])
    if (!story) {
        return undefined
    }
    return {
        story,
        layoutStory: layoutStory ?? null,
        previewToken: previewToken ? previewToken : null,
    }
}