import {Block} from "@johannes-lindgren/storyblok-js";

type BlockComponentProps<D extends Record<string, unknown> = Record<string, unknown>> = { block: Block<D> }
type BlockComponent<D extends Record<string, unknown> = Record<string, unknown>> = (props: BlockComponentProps<D>) => JSX.Element

export {BlockComponent, BlockComponentProps}