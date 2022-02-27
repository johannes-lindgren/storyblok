import type {BlockComponent} from "@src/block/block-component";
import {DefaultFallback} from "@src/block/default-fallback";

/**
 * maps Storyblok component names to React components
 */
type BlockComponentMapping = Record<string, BlockComponent | undefined>

/**
 * Pass an object of this type to makeBlockComponent() to build your dynamic block component
 * @prop mapping a dictionary that maps Storyblok component names to React components
 * @prop Fallback When failing to lookup in [mapping]
 * @prop Wrapper A component that will wrap
 */
type BlockComponentFactoryOptions = {
    mapping?: BlockComponentMapping
    Fallback?: BlockComponent
}

type BlockComponentFactory = (options: BlockComponentFactoryOptions) => BlockComponent

/**
 * @param mapping
 * @param Fallback
 * @param Wrapper
 * @returns A React component for rendering Storyblok blocks dynamically
 */
const makeDynamicBlockComponent: BlockComponentFactory = ({
                                                       mapping = {},
                                                       Fallback = DefaultFallback,
                                                   }) => (
    function DynamicBlockComponent({block}) {
        const BlockComponent = mapping[block.component]
        const Component = BlockComponent ?? Fallback
        return (
            <Component block={block}/>
        )
    }
)

export {makeDynamicBlockComponent, BlockComponentFactoryOptions, BlockComponentMapping}