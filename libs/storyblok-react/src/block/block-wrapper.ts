// A component that wraps a block component
import {FunctionComponent} from "react";
import {BlockComponentProps} from "@src/block/block-component";

/**
 * A component that wraps around a block component. Useful for making block components editable in preview mode, setting error boundaries.
 */
type BlockWrapperComponent = FunctionComponent<BlockComponentProps>

export {BlockWrapperComponent}