import {
  array,
  literal,
  object,
  Parser,
  ParseResult,
  parseString,
} from 'pure-parse'
import { BlockContent } from '../block'
import { AssetContent } from '../asset'
import { Mark, parseMark } from './marks'

// TODO: Add more node types
export type RichTextContent = DocNode

// TODO options as a parameter
export function parseRichTextContent(
  data: unknown,
): ParseResult<RichTextContent> {
  return parseDocNode(data)
}

export const richTextContent = (): Parser<RichTextContent> =>
  parseRichTextContent

/*
 * Nodes
 */

export type DocNode = {
  type: 'doc'
  content: RichTextContent[]
}

export const parseDocNode = object<RichTextContent>({
  type: literal('doc'),
  content: array(parseRichTextContent),
})

export type ParagraphNode = {
  type: 'paragraph'
  content: RichTextContent[]
}

export const parseParagraphNode = object<ParagraphNode>({
  type: literal('paragraph'),
  content: array(parseRichTextContent),
})

export type TextNode = {
  type: 'text'
  text: string
  marks: Mark[]
}

export const parseTextNode = object<TextNode>({
  type: literal('text'),
  text: parseString,
  marks: array(parseMark),
})

export type HorizontalRuleNode = {
  type: 'horizontal_rule'
}

export const parseHorizontalRuleNode = object<HorizontalRuleNode>({
  type: literal('horizontal_rule'),
})

export type BlockQuoteNode = {
  type: 'blockquote'
  content: RichTextContent[]
}

export const parseBlockQuoteNode = object<BlockQuoteNode>({
  type: literal('blockquote'),
  content: array(parseRichTextContent),
})

export type ListItemNode = {
  type: 'list_item'
  content: RichTextContent[]
}

export const parseListItemNode = object<ListItemNode>({
  type: literal('list_item'),
  content: array(parseRichTextContent),
})

export type BulletListNode = {
  type: 'bullet_list'
  content: ListItemNode[]
}

export const parseBulletListNode = object<BulletListNode>({
  type: literal('bullet_list'),
  content: array(parseListItemNode),
})

export type OrderedListNode = {
  type: 'ordered_list'
  content: ListItemNode[]
}

export const parseOrderedListNode = object<OrderedListNode>({
  type: literal('ordered_list'),
  content: array(parseListItemNode),
})

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
