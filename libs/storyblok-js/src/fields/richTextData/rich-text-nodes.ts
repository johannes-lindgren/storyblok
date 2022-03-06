import {Block} from "../../block";
import {Mark} from "./rich-text-marks";

export type RichTextNode<NodeType extends string = string> = {
    type: NodeType
}
// Rich text child nodes are contained within the content property.
type ContentProp<NodeType = RichTextNode> = { content?: NodeType[] }
// Rich Text node attributes
export type AttributeProp<T> = { attrs: T }
/**
 *  (Known) Rich Text Node Types
 */

// The Root node of a rich text field
export type RichTextData = DocNode // Alias
export type DocNode = RichTextNode<'doc'> & ContentProp
export type ParagraphNode = RichTextNode<'paragraph'> & ContentProp
export type HeadingNode =
    RichTextNode<'heading'>
    & ContentProp
    & AttributeProp<{ level: 1 | 2 | 3 | 4 | 5 | 6 }>
export type BulletListNode = RichTextNode<'bullet_list'> & ContentProp<ListItemNode>
export type OrderedListNode = RichTextNode<'ordered_list'> & ContentProp<ListItemNode>
export type ListItemNode = RichTextNode<'list_item'> & ContentProp
export type BlockquoteNode = RichTextNode<'blockquote'> & ContentProp
export type CodeBlockNode = RichTextNode<'code_block'> & AttributeProp<{
    class: string
}> & ContentProp
export type HorizontalRuleNode = RichTextNode<'horizontal_rule'>
export type ImageNode = RichTextNode<'image'> & AttributeProp<{
    alt: string
    src: string
    title: string
}>
export type BlockNode = RichTextNode<'blok'> & AttributeProp<{
    id: string
    body: Block[]
}>
export type TextNode = RichTextNode<'text'> & {
    text?: string,
    marks?: Mark[]
}