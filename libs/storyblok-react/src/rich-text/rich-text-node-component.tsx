import {RichTextNode} from "@johannes-lindgren/storyblok-js";

type RichTextNodeComponentProps<Node> = { node: Node, RichTextNode: RichTextNodeComponent }
type RichTextNodeComponent<Node extends RichTextNode = RichTextNode> = (props: RichTextNodeComponentProps<Node>) => JSX.Element

export {RichTextNodeComponent}
