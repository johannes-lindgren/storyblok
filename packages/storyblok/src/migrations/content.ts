import {
  literal,
  object,
  parseBoolean,
  Parser,
  parseString,
  success,
} from 'pure-parse'

type TextContent = {
  tag: 'text'
  content: string
}

type NumberContent = {
  tag: 'number'
  content: string
}

type BooleanContent = {
  tag: 'boolean'
  content: boolean
}

type BlockContent<C extends Record<string, Content>> = {
  tag: 'block'
  content: C
}

type Content =
  | TextContent
  | NumberContent
  | BooleanContent
  | BlockContent<{
      [key: string]: Content
    }>

const parseAstNode =
  <const Tag, Content>(
    tag: Tag,
    contentParser: Parser<Content>,
  ): Parser<{
    tag: Tag
    content: Content
  }> =>
  (data) => {
    const result = contentParser(data)
    if (result.tag === 'success') {
      return success({
        tag: tag,
        content: result.value,
      })
    } else {
      return result
    }
  }

const parseTextContent: Parser<TextContent> = parseAstNode('text', parseString)

const parseNumberContent: Parser<NumberContent> = parseAstNode(
  'number',
  parseString,
)

const parseBooleanContent: Parser<BooleanContent> = parseAstNode(
  'boolean',
  parseBoolean,
)

const parseBlockContent = <C extends Record<string, Content>>(
  contentParser: Parser<C>,
): Parser<BlockContent<C>> =>
  object({
    tag: literal('block'),
    content: contentParser,
  }) as Parser<BlockContent<C>>
