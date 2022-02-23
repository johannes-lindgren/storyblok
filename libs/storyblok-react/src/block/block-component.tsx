import {Block} from "@johannes-lindgren/storyblok-js";

type BlockComponentProps<B extends Block = Block> = { block: B }
type BlockComponent<B extends Block = Block> = (props: BlockComponentProps<B>) => JSX.Element

export {BlockComponent, BlockComponentProps}