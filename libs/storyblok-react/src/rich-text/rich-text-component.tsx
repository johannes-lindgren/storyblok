import {DocNode} from "@johannes-lindgren/storyblok-js";

type RichTextComponentProps = { richText?: DocNode }
type RichTextComponent = (props: RichTextComponentProps) => JSX.Element

export {RichTextComponent, RichTextComponentProps}
