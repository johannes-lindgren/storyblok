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
    Block: BlockComponent
    RichText: RichTextComponent
    Story: StoryComponent
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
    const Block = makeDynamicBlockComponent(blockOptions)
    const defaultMappingOverride = {
        mappingOverride: makeBlockMapping(Block)
    }
    const richTextOptionsOther: RichTextComponentFactoryOptions = {
        ...defaultMappingOverride,
        ...(richTextOptions.mappingOverride ?? {}),
    }
    const RichText = makeRichTextComponent(richTextOptionsOther)
    const DynamicStory = makeStoryComponent(({story}) => (
        <Block block={story.content} />
    ))
    return {
        Block,
        RichText,
        Story: DynamicStory,
    }
}
