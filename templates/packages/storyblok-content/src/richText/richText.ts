import {
  array,
  equals,
  object,
  oneOf,
  parseNumber,
  type Parser,
  type ParseResult,
  parseString,
  withDefault,
} from 'pure-parse'
import { type Mark, parseMark } from './marks'
import { blockContent, type BlockContent } from '../block'

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
  type: equals('doc'),
  content: array(parseRichTextContent),
})

export type ParagraphNode = {
  type: 'paragraph'
  content: RichTextContent[]
}

export const parseParagraphNode = object<ParagraphNode>({
  type: equals('paragraph'),
  content: withDefault(array(parseRichTextContent), []),
})

export type TextNode = {
  type: 'text'
  text: string
  marks: Mark[]
}

export const parseTextNode = object<TextNode>({
  type: equals('text'),
  text: parseString,
  marks: withDefault(array(parseMark), []),
})

export type HorizontalRuleNode = {
  type: 'horizontal_rule'
}

export const parseHorizontalRuleNode = object<HorizontalRuleNode>({
  type: equals('horizontal_rule'),
})

export type BlockQuoteNode = {
  type: 'blockquote'
  content: RichTextContent[]
}

export const parseBlockQuoteNode = object<BlockQuoteNode>({
  type: equals('blockquote'),
  content: array(parseRichTextContent),
})

export type ListItemNode = {
  type: 'list_item'
  content: RichTextContent[]
}

export const parseListItemNode = object<ListItemNode>({
  type: equals('list_item'),
  content: array(parseRichTextContent),
})

export type BulletListNode = {
  type: 'bullet_list'
  content: ListItemNode[]
}

export const parseBulletListNode = object<BulletListNode>({
  type: equals('bullet_list'),
  content: array(parseListItemNode),
})

export type OrderedListNode = {
  type: 'ordered_list'
  content: ListItemNode[]
}

export const parseOrderedListNode = object<OrderedListNode>({
  type: equals('ordered_list'),
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
  type: equals('heading'),
  attrs: object({
    level: oneOf(
      equals(1),
      equals(2),
      equals(3),
      equals(4),
      equals(5),
      equals(6),
    ),
  }),
  content: withDefault(array(parseRichTextContent), []),
})

export type BlockNode = {
  type: 'blok'
  attrs: {
    // Actually a UUID—not an ID
    id: string
    body: BlockContent[]
  }
}

export const parseBlockNode = object<BlockNode>({
  type: equals('blok'),
  attrs: object({
    id: parseString,
    body: array(blockContent({ component: parseString })),
  }),
})

export type CodeBlockNode = {
  type: 'code_block'
  content: RichTextContent[]
}

export const parseCodeBlockNode = object<CodeBlockNode>({
  type: equals('code_block'),
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
  type: equals('image'),
  attrs: object<ImageAttrs>({
    id: parseNumber,
    alt: parseString,
    src: parseString,
    title: parseString,
    source: parseString,
    copyright: parseString,
  }),
})
