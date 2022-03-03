import {DefaultWrapper} from "@src/block/default-wrapper";
// import {BlockComponent} from "@src/block";
import {Block} from "@johannes-lindgren/storyblok-js";

type R = Record<string, unknown>
type BlockComponentProps<BlockData extends R = {}> = { block: Block<BlockData> }
type BlockComponent<BlockData extends R = {}, OtherProps extends R = {}> = (props: OtherProps & BlockComponentProps<BlockData>) => JSX.Element

type BlockComponentFactory = <BlockData extends R = {}, OtherProps extends R = {}, >(componentName: string, Component: BlockComponent<BlockData, OtherProps>) => WithComponentName<BlockComponent<BlockData, OtherProps>>

type WithComponentName<T> = T & { componentName: string }

/**
 * Creates a React component that can render blocks. Preview will be enabled if wrapped within an enabled PreviewProvider.
 * @param componentName The Storyblok component name. The value of the 'component' property on the blocks. For example: { "component": "feature", ... }
 * @param BlockComponent A React component that accepts a "block" attribute.
 */
const makeBlockComponent: BlockComponentFactory = (componentName, BlockComponent) => (
    Object.assign(
        (props: Parameters<typeof BlockComponent>[0]) => (
            <DefaultWrapper block={props.block}>
                <BlockComponent {...props}/>
            </DefaultWrapper>
        ),{
            // Add displayName and componentName as properties to the function.
            displayName: componentName,
            componentName: componentName,
        }
    )
)

export {makeBlockComponent, BlockComponentProps, BlockComponent, WithComponentName}