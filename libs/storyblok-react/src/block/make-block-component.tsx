import {DefaultWrapper} from "@src/block/default-wrapper";
// import {BlockComponent} from "@src/block";
import {Block} from "@johannes-lindgren/storyblok-js";

type R = Record<string, unknown>

type BlockComponentProps<BlockData extends R = R> = { block: Block<BlockData> }
type BlockComponent<BlockData extends R = R, OtherProps extends R = R> = (props: OtherProps & BlockComponentProps<BlockData>) => JSX.Element

type BlockComponentFactory = <BlockData extends R = R, OtherProps extends R = R, >(Component: BlockComponent<BlockData, OtherProps>) => BlockComponent<BlockData, OtherProps>

const makeBlockComponent: BlockComponentFactory = (BlockComponent) => (
    (props) => (
        <DefaultWrapper block={props.block}>
            <BlockComponent {...props}/>
        </DefaultWrapper>
    )
)


export {makeBlockComponent, BlockComponentProps, BlockComponent}