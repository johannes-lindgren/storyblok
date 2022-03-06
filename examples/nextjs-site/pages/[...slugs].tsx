import {GetServerSideProps, NextPage} from "next";
import {getPageProps} from "@storyblok-nextjs/getPageProps";
import {LayoutStory} from "@resume-builder/../src/components/layout";
import {resolve_links, resolve_relations, DynamicStory} from "@resume-builder/../src/components/dynamic-components";
import {PreviewProvider} from "@johannes-lindgren/storyblok-react";
import {PageProps} from '@src/storyblok-nextjs/getPageProps'

type UrlQuery = {
    slugs: string[]
}


const StoryblokPage: NextPage<PageProps> = ({layoutStory, story, previewToken}) => {
    if(story.content.component === 'layout' || !layoutStory){
        return (
            <PreviewProvider previewToken={previewToken} enabled={!!previewToken} resolveRelations={resolve_relations} resolveLinks={resolve_links} >
                <DynamicStory story={story} />
            </PreviewProvider>
        )
    }
    return (
        <PreviewProvider previewToken={previewToken} enabled={!!previewToken} resolveRelations={resolve_relations} resolveLinks={resolve_links} >
            <LayoutStory story={layoutStory} >
                <DynamicStory story={story} />
            </LayoutStory>
        </PreviewProvider>
    )
}

export default StoryblokPage

export const getServerSideProps: GetServerSideProps<PageProps, UrlQuery> = async ({
                                                                                      params,
                                                                                      preview,
                                                                                      locale,
                                                                                      defaultLocale
                                                                                  }) => {
    const slugs = params?.slugs ?? []

    const previewToken = process.env.STORYBLOK_PREVIEW_TOKEN

    if (!previewToken) {
        throw new Error('The backend has not been configured with a preview token.')
    }

    const storyProps = await getPageProps(slugs, {
        previewToken,
        preview: !!preview,
        locale,
        defaultLocale,
    })
    if (!storyProps) {
        return {
            notFound: true
        }
    }
    return {
        props: storyProps
    }
}