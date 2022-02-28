import {BlockComponent} from "@src/block/block-component";
import {DefaultWrapper} from "@src/block/default-wrapper";

type BlockComponentFactory = <C extends Record<string, unknown> = Record<string, unknown>, >(Component: BlockComponent<C>) => BlockComponent<C>

const makeBlockComponent: BlockComponentFactory = (BlockComponent) => (
    (props) => (
        <DefaultWrapper block={props.block}>
            <BlockComponent block={props.block} />
        </DefaultWrapper>
    )
)

export {makeBlockComponent}