import {
    BlockComponent
} from "@src/block";
import {
    RichTextComponent,
} from "@src/rich-text/rich-text-component";
import {makeStoryComponent, StoryComponent} from "@src/story/story-component-factory";
import {BlockComponentFactoryOptions, makeDynamicBlockComponent} from "@src/block";
import {
    makeRichTextComponent,
    RichTextComponentFactoryOptions,
    RichTextComponentMapping
} from "@src/rich-text/rich-text-component-factory";

type MakeComponentOptions = {
    blockOptions?: BlockComponentFactoryOptions
    richTextOptions?: RichTextComponentFactoryOptions
}

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
 * export {} = makeStoryblokComponents({ blockOptions: { mapping: { page: (props) => <div>{props.block.title}</div>}}})
 * @param richTextOptions
 * @param blockOptions
 * @returns a .
 */
export const makeStoryblokComponents: MakeStoryblokComponents = ({richTextOptions= {}, blockOptions = {}}) => {
    const DynamicBlock = makeDynamicBlockComponent(blockOptions)
    // Use the dynamic block component to render blocks within Rich Text
    const defaultRichTextMappingOverride = {
        mappingOverride: makeBlockMapping(DynamicBlock)
    }
    const richTextOptionsOther: RichTextComponentFactoryOptions = {
        ...defaultRichTextMappingOverride,
        ...(richTextOptions.mappingOverride ?? {}),
    }
    const RichText = makeRichTextComponent(richTextOptionsOther)
    const DynamicStory = makeStoryComponent(({story}) => (
        <DynamicBlock block={story.content} />
    ))
    return {
        DynamicBlock,
        RichText,
        DynamicStory,
    }
}
