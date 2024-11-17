import {
  array,
  literal,
  object,
  oneOf,
  optional,
  parseNumber,
  Parser,
  ParseResult,
  parseString,
  parseUnknown,
  withDefault,
} from 'pure-parse'
import { BlockContent } from '../block'
import { Mark, parseMark } from './marks'

export type RichTextContent =
  | DocNode
  | ParagraphNode
  | TextNode
  | HorizontalRuleNode
  | BlockQuoteNode
  | BulletListNode
  | OrderedListNode
  | HeadingNode
  | BlockNode
  | CodeBlockNode
  | ImageNode

export function parseRichTextContent(
  data: unknown,
): ParseResult<RichTextContent> {
  return oneOf(
    parseDocNode,
    parseParagraphNode,
    parseTextNode,
    parseHorizontalRuleNode,
    parseBlockQuoteNode,
    parseBulletListNode,
    parseOrderedListNode,
    parseHeadingNode,
    parseBlockNode,
    parseCodeBlockNode,
    parseImageNode,
  )(data)
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
  content: withDefault(array(parseRichTextContent), []),
})

export type TextNode = {
  type: 'text'
  text: string
  marks: Mark[]
}

export const parseTextNode = object<TextNode>({
  type: literal('text'),
  text: parseString,
  marks: withDefault(array(parseMark), []),
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

export const parseHeadingNode = object<HeadingNode>({
  type: literal('heading'),
  attrs: object({
    level: oneOf(
      literal(1),
      literal(2),
      literal(3),
      literal(4),
      literal(5),
      literal(6),
    ),
  }),
  content: withDefault(array(parseRichTextContent), []),
})

export type BlockNode = {
  type: 'blok'
  attrs: {
    // Actually a UUID
    id: string
    body: unknown[]
  }
}

export const parseBlockNode = object<BlockNode>({
  type: literal('blok'),
  attrs: object({
    id: parseString,
    body: array(parseUnknown),
  }),
})

export type CodeBlockNode = {
  type: 'code_block'
  content: RichTextContent[]
}

export const parseCodeBlockNode = object<CodeBlockNode>({
  type: literal('code_block'),
  content: withDefault(array(parseRichTextContent), []),
})

export type ImageNode = {
  type: 'image'
  attrs: ImageAttrs
}

export type ImageAttrs = {
  id: number
  alt: string
  src: string
  title: string
  source: string
  copyright: string
}

export const parseImageNode = object<ImageNode>({
  type: literal('image'),
  attrs: object<ImageAttrs>({
    id: parseNumber,
    alt: parseString,
    src: parseString,
    title: parseString,
    source: parseString,
    copyright: parseString,
  }),
})
