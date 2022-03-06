import {DefaultWrapper} from "@src/block/default-wrapper";
// import {BlockComponent} from "@src/block";
import {Block} from "@johannes-lindgren/storyblok-js";
import {WithComponentName} from "@src/with-component-name"

type R = Record<string, unknown>
type BlockComponentProps<BlockData extends R = {}> = { block: Block<BlockData> }
type BlockComponent<BlockData extends R = {}, OtherProps extends R = {}> = (props: OtherProps & BlockComponentProps<BlockData>) => JSX.Element

function makeBlockComponent<BlockData extends R = {}, OtherProps extends R = {}, >(Component: BlockComponent<BlockData, OtherProps>, componentName: string): WithComponentName<BlockComponent<BlockData, OtherProps>>;
function makeBlockComponent<BlockData extends R = {}, OtherProps extends R = {}, >(Component: BlockComponent<BlockData, OtherProps>): BlockComponent<BlockData, OtherProps>;

/**
 * Creates a React component that can render blocks. Preview will be enabled if wrapped within an enabled PreviewProvider.
 * @param BlockComponent A React component that accepts a "block" attribute.
 * @param componentName Optional: if included, the component can be registered within the dynamic block components. The value should be the Storyblok component name that this React component correspond to. I.e. the value of the 'component' property on the blocks.
 *
 */
function makeBlockComponent<BlockData extends R = {}, OtherProps extends R = {}, >(BlockComponent: BlockComponent<BlockData, OtherProps>, componentName?: string) {
    const BlockWithWrapper = (props: Parameters<typeof BlockComponent>[0]) => (
        <DefaultWrapper block={props.block}>
            <BlockComponent {...props}/>
        </DefaultWrapper>
    )
    if (!componentName) {
        return BlockWithWrapper
    }
    return (
        Object.assign(
            BlockWithWrapper, {
                // Add displayName and componentName as properties to the function.
                displayName: componentName,
                componentName: componentName,
            })
    )
}

export {makeBlockComponent, BlockComponentProps, BlockComponent}