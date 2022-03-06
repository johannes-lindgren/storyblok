import type {BlockComponent} from "@src/block";
import type {WithComponentName} from "@src/with-component-name";
import {DefaultBlockFallback} from "@src/block/default-block-fallback";

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
    blockComponents?: WithComponentName<BlockComponent>[]
    BlockFallback?: BlockComponent
}

type BlockComponentFactory = (options: BlockComponentFactoryOptions) => BlockComponent

const makeComponentMapping = (components: WithComponentName<BlockComponent>[]): BlockComponentMapping => (
    components?.reduce((mapping, Component) => {
        return Object.assign(
            mapping,
            {
                [Component.componentName]: Component
            }
        )
    }, {})
)

/**
 * @returns A React component for rendering Storyblok blocks dynamically
 */
const makeDynamicBlockComponent: BlockComponentFactory = ({
                                                       blockComponents = [],
                                                       BlockFallback = DefaultBlockFallback,
                                                   }) => (
    function DynamicBlockComponent({block}) {
        if(!block){
            return <></>
        }
        const mapping = makeComponentMapping(blockComponents)
        const BlockComponent = mapping[block.component]
        const Component = BlockComponent ?? BlockFallback
        return (
            <Component block={block}/>
        )
    }
)

export {makeDynamicBlockComponent, BlockComponentFactoryOptions, BlockComponentMapping}