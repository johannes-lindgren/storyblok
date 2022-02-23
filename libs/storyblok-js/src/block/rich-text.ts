import {Block} from "./index";

export type RichText = DocNode

export type RichTextNode<NodeType extends string = string> = {
    type: NodeType
}


// Known rich text node types

/**
 *  The root node of a rich text field value
 */
export type DocNode = RichTextNode<'doc'> & ContentProp
export type ParagraphNode = RichTextNode<'paragraph'> & ContentProp
export type HeadingNode = RichTextNode<'heading'> & ContentProp & AttributeProp<HeadingAttribute>
export type BulletListNode = RichTextNode<'bullet_list'> & ContentProp<ListItemNode>
export type OrderedListNode = RichTextNode<'ordered_list'> & ContentProp<ListItemNode>
export type ListItemNode = RichTextNode<'list_item'> & ContentProp
export type BlockquoteNode = RichTextNode<'blockquote'> & ContentProp
export type CodeBlockNode = RichTextNode<'code_block'> & AttributeProp<ClassAttributes> & ContentProp
export type HorizontalRuleNode = RichTextNode<'horizontal_rule'>
export type ImageNode = RichTextNode<'image'> & AttributeProp<ImageAttributes>
export type BlockNode = RichTextNode<'blok'> & AttributeProp<BlockAttributes>

/**
 * Rich text child nodes are contained within the content property.
 */
export type ContentProp<NodeType = RichTextNode> = { content?: NodeType[] }

export type TextNode = RichTextNode<'text'> & {
    text?: string,
    marks?: Mark[]
}

// Rich Text node attributes

export type AttributeProp<T> = { attrs: T }

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6
export type HeadingAttribute = { level: HeadingLevel }

export type ImageAttributes = {
    alt: string
    src: string
    title: string
}

export type BlockAttributes = {
    id: string
    body: Block[]
}

export type ClassAttributes = {
    class: string
}

// Marks

export type SimpleMark<T extends string> = { type: T }

export type ItalicMark = SimpleMark<'italic'>
export type BoldMark = SimpleMark<'bold'>
export type StrikeMark = SimpleMark<'strike'>
export type UnderlineMark = SimpleMark<'underline'>
export type CodeMark = SimpleMark<'code'>

export type StyledMark = SimpleMark<'styled'> & AttributeProp<ClassAttributes>

type AnchorTarget =
    | '_self'
    | '_blank'
    | '_parent'
    | '_top'
    | string

export type StoryLinkMark = SimpleMark<'link'> & AttributeProp<{
    href: string | 0,
    uuid: string | null,
    anchor: null,
    target: AnchorTarget| null,
    linktype: 'story'
}>

export type UrlLinkMark = SimpleMark<'link'> & AttributeProp<{
    href: string | 0,
    uuid: null,
    anchor: null,
    target: AnchorTarget| null,
    linktype: 'url'
}>

export type EmailLinkMark = SimpleMark<'link'> & AttributeProp<{
    href: string | 0,
    uuid: null,
    anchor: null,
    target: AnchorTarget| null,
    linktype: 'email'
}>

export type AssetLinkMark = SimpleMark<'link'> & AttributeProp<{
    href: string | 0,
    uuid: null,
    anchor: null,
    target: AnchorTarget | null,
    linktype: 'asset'
}>

export type LinkType = LinkMark['attrs']['linktype']

export type LinkMark = StoryLinkMark | UrlLinkMark | EmailLinkMark | AssetLinkMark

export type Mark = ItalicMark | BoldMark | StrikeMark | UnderlineMark | CodeMark | StyledMark | LinkMark

export type MarkType = Mark['type'] | string

