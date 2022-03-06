import {
    BlockComponent
} from "@src/block";
import {
    RichTextComponent,
} from "@src/rich-text/rich-text-component";
import {BlockComponentFactoryOptions, makeDynamicBlockComponent} from "@src/block";
import {
    makeRichTextComponent,
    RichTextComponentFactoryOptions,
    RichTextComponentMapping
} from "@src/rich-text/rich-text-component-factory";
import {StoryComponent} from "@src/story/make-story-component";
import {makeDynamicStoryComponent, StoryComponentFactoryOptions} from "@src/story/dynamic-story-component";

type MakeComponentOptions = BlockComponentFactoryOptions & RichTextComponentFactoryOptions & StoryComponentFactoryOptions

type StoryblokComponents = {
    DynamicBlock: BlockComponent
    RichText: RichTextComponent
    DynamicStory: StoryComponent
}


const makeBlockMapping = (Block: BlockComponent): Partial<RichTextComponentMapping> => ({
    blok: ({node}) => (
        <>
            {node.attrs.body.map(
                block => <Block block={block} key={block._uid}/>
            )}
        </>
    )
})

type MakeStoryblokComponents = (options: MakeComponentOptions) => StoryblokComponents

/**
 * Invoke this function once to build your React components for Storyblok. Use like:
 */
export const makeStoryblokComponents: MakeStoryblokComponents = (options) => {
    const {blockComponents, BlockFallback, storyComponents, StoryFallback, RichTextFallback, richTextComponentMapping} = options
    const blockOptions: BlockComponentFactoryOptions = {blockComponents, BlockFallback}

    const DynamicBlock = makeDynamicBlockComponent(blockOptions)

    // By default, the 'blok' rich text nodes should render with <DynamicBlock>.
    const defaultRichTextMappingOverride = makeBlockMapping(DynamicBlock)
    const richTextOptions: RichTextComponentFactoryOptions = {
        richTextComponentMapping: ({
            ...defaultRichTextMappingOverride,
            ...richTextComponentMapping, // Allow the user to override any mapping
        }),
        RichTextFallback,
    }
    const RichText = makeRichTextComponent(richTextOptions)
    const DynamicStory = makeDynamicStoryComponent({
        storyComponents,
        blockComponents,
        StoryFallback,
    })
    return {
        DynamicBlock,
        RichText,
        DynamicStory,
    }
}
