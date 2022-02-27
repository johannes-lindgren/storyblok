import {BlockComponent, BlockComponentProps} from "@src/block/block-component";
import {DefaultWrapper} from "@src/block/default-wrapper";

type BlockComponentFactory = <C extends Record<string, unknown> = Record<string, unknown>, >(Component: BlockComponent<C>) => BlockComponent<C>

const makeBlockComponent: BlockComponentFactory = <C extends Record<string, unknown> = Record<string, unknown>, >(BlockComponent: (props: BlockComponentProps<C>) => JSX.Element) => {
    const BlockComponentWithWrapper: BlockComponent<C> = (props) => (
        <DefaultWrapper block={props.block}>
            <BlockComponent block={props.block} />
        </DefaultWrapper>
    )
    return BlockComponentWithWrapper
}
export {makeBlockComponent}