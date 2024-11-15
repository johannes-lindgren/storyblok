import { array, literal, object, Parser } from 'pure-parse'
import { BlockContent } from '../block'
import { AssetContent } from '../asset'

/*
 * Nodes
 */

export type DocNode = {
  type: 'doc'
  content: RichTextContent[]
}

export type ParagraphNode = {
  type: 'paragraph'
  content: RichTextContent[]
}

export type TextContent = {
  type: 'text'
  text: string
  marks: Mark[]
}

export type HorizontalRuleNode = {
  type: 'horizontal_rule'
}

export type BlockQuoteNode = {
  type: 'blockquote'
  content: RichTextContent[]
}

export type BulletListNode = {
  type: 'bullet_list'
  content: ListItemNode[]
}

export type OrderedListNode = {
  type: 'ordered_list'
  content: ListItemNode[]
}

export type ListItemNode = {
  type: 'list_item'
  content: RichTextContent[]
}

export type HeadingNode = {
  type: 'heading'
  attrs: {
    level: 1 | 2 | 3 | 4 | 5 | 6
  }
  content: RichTextContent[]
}

export type BlockNode = {
  type: 'blok'
  attrs: {
    // Actually a UUID
    id: string
    body: BlockContent[]
  }
  content: RichTextContent[]
}

export type CodeBlockNode = {
  type: 'code_block'
  content: RichTextContent[]
}

export type ImageNode = {
  type: 'image'
  attrs: AssetContent
}

/*
 * Marks
 */

export type ItalicMark = {
  type: 'italic'
}

export type BoldMark = {
  type: 'bold'
}

export type UnderlineMark = {
  type: 'underline'
}

export type StrikethroughMark = {
  type: 'strike'
}

export type SuperScriptMark = {
  type: 'superscript'
}

export type SubScriptMark = {
  type: 'subscript'
}

export type CodeMark = {
  type: 'code'
}

export type LinkMark = {
  type: 'link'
  attrs: LinkAttrs
}

export type UrlLinkAttrs = {
  linktype: 'url'
  href: string
}

export type StoryLinkAttrs = {
  linktype: 'story'
  href: string
  uuid: string
}

export type EmailLinkAttrs = {
  linktype: 'email'
  href: string
}

export type AssetLinkAttrs = {
  linktype: 'asset'
  href: string
}

export type LinkAttrs =
  | UrlLinkAttrs
  | StoryLinkAttrs
  | EmailLinkAttrs
  | AssetLinkAttrs

export type Mark =
  | ItalicMark
  | BoldMark
  | UnderlineMark
  | StrikethroughMark
  | SuperScriptMark
  | SubScriptMark
  | CodeMark
  | LinkMark

// TODO: Add more node types
export type RichTextContent = DocNode

// TODO options as a parameter
export const richTextContent = (): Parser<RichTextContent> =>
  object<RichTextContent>({
    type: literal('doc'),
    content: array(richTextContent()),
  })
