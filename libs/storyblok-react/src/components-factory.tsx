import {
    BlockComponent
} from "@src/block/block-component";
import {
    RichTextComponent,
} from "@src/rich-text/rich-text-component";
import { makeStoryComponent, StoryComponent} from "@src/story/story-component";
import {StoryblokOptionsStatic} from "@src/helpers/storyblok-options";
import {BlockComponentFactoryOptions, makeDynamicBlockComponent} from "@src/block";
import {
    makeRichTextComponent,
    RichTextComponentFactoryOptions,
    RichTextComponentMapping
} from "@src/rich-text/rich-text-component-factory";

type MakeComponentOptions = {
    blockOptions?: BlockComponentFactoryOptions
    richTextOptions?: RichTextComponentFactoryOptions
} & StoryblokOptionsStatic

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
 * @param staticOptions
 * @returns a .
 */
export const makeStoryblokComponents: MakeStoryblokComponents = ({richTextOptions= {}, blockOptions = {}, ...staticOptions}) => {
    const Block = makeDynamicBlockComponent(blockOptions)
    const defaultMappingOverride = {
        mappingOverride: makeBlockMapping(Block)
    }
    const richTextOptionsOther: RichTextComponentFactoryOptions = {
        ...defaultMappingOverride,
        ...(richTextOptions.mappingOverride ?? {}),
    }
    const RichText = makeRichTextComponent(richTextOptionsOther)
    const Story = makeStoryComponent(Block, staticOptions)
    return {
        Block,
        RichText,
        Story,
    }
}
