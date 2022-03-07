import {makeStoryblokComponents} from "@johannes-lindgren/storyblok-react";
// Storyblok Components
import {Resume} from "@src/components/resume";
import {ExamplePage} from "@src/components/examplePage";
import {Section} from "@src/components/section";
import {Admonition} from "@src/components/admonition";
import {Header} from "@src/components/header";
import {Footer} from "@src/components/footer";
import {Fallback} from "@src/components/fallback";
import {NavItem} from "@src/components/navItem";
import {Article} from "@src/components/article";
import {AuthorStory} from "@src/components/author";
// import {Layout} from "@resume-builder/components/layout";

export const resolve_links = 'story'
export const resolve_relations = ['article.authors']

// console.log('Layout', Layout) // TODO why is Layout undefined on the client??? Other components are not. SSR works as expected.

/**
 * @param options blockComponents is an array of components that were built with makeBlockComponent()
 */
export const {DynamicStory, DynamicBlock, RichText} = makeStoryblokComponents({
    blockComponents: [
        Resume,
        ExamplePage,
        Section,
        Admonition,
        Header,
        // Layout,
        Footer,
        NavItem,
    ],
    storyComponents: [
        Article,
        AuthorStory,
    ],
    BlockFallback: Fallback
})
