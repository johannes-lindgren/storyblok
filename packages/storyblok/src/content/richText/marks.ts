import { literal, object, oneOf, parseString } from 'pure-parse'

export type ItalicMark = {
  type: 'italic'
}

export const parseItalicMark = object<ItalicMark>({
  type: literal('italic'),
})

export type BoldMark = {
  type: 'bold'
}

export const parseBoldMark = object<BoldMark>({
  type: literal('bold'),
})

export type UnderlineMark = {
  type: 'underline'
}

export const parseUnderlineMark = object<UnderlineMark>({
  type: literal('underline'),
})

export type StrikethroughMark = {
  type: 'strike'
}

export const parseStrikethroughMark = object<StrikethroughMark>({
  type: literal('strike'),
})

export type SuperScriptMark = {
  type: 'superscript'
}

export const parseSuperScriptMark = object<SuperScriptMark>({
  type: literal('superscript'),
})

export type SubScriptMark = {
  type: 'subscript'
}

export const parseSubScriptMark = object<SubScriptMark>({
  type: literal('subscript'),
})

export type CodeMark = {
  type: 'code'
}

export const parseCodeMark = object<CodeMark>({
  type: literal('code'),
})

export type UrlLinkAttrs = {
  linktype: 'url'
  href: string
}

export const parseUrlLinkAttrs = object<UrlLinkAttrs>({
  linktype: literal('url'),
  href: parseString,
})

export type StoryLinkAttrs = {
  linktype: 'story'
  href: string
  uuid: string
}

export const parseStoryLinkAttrs = object<StoryLinkAttrs>({
  linktype: literal('story'),
  href: parseString,
  uuid: parseString,
})

export type EmailLinkAttrs = {
  linktype: 'email'
  href: string
}

export const parseEmailLinkAttrs = object<EmailLinkAttrs>({
  linktype: literal('email'),
  href: parseString,
})

export type AssetLinkAttrs = {
  linktype: 'asset'
  href: string
}

export const parseAssetLinkAttrs = object<AssetLinkAttrs>({
  linktype: literal('asset'),
  href: parseString,
})

export type LinkAttrs =
  | UrlLinkAttrs
  | StoryLinkAttrs
  | EmailLinkAttrs
  | AssetLinkAttrs

export const parseLinkAttrs = oneOf(
  parseUrlLinkAttrs,
  parseStoryLinkAttrs,
  parseEmailLinkAttrs,
  parseAssetLinkAttrs,
)

export type LinkMark = {
  type: 'link'
  attrs: LinkAttrs
}

export const parseLinkMark = object<LinkMark>({
  type: literal('link'),
  attrs: parseLinkAttrs,
})

export type TextStyleAttrs = {
  color: string
}

export const parseTextStyleAttrs = object<TextStyleAttrs>({
  color: parseString,
})

export type TextStyleMark = {
  type: 'textStyle'
  attrs: TextStyleAttrs
}

export const parseTextStyleMark = object<TextStyleMark>({
  type: literal('textStyle'),
  attrs: parseTextStyleAttrs,
})

export type HighlightAttrs = {
  color: string
}

export const parseHighlightAttrs = object<HighlightAttrs>({
  color: parseString,
})

export type HighlightMark = {
  type: 'highlight'
  attrs: HighlightAttrs
}

export const parseHighlightMark = object<HighlightMark>({
  type: literal('highlight'),
  attrs: parseHighlightAttrs,
})

export type StyledAttrs = {
  class: string
}

export const parseStyledAttrs = object<StyledAttrs>({
  class: parseString,
})

export type StyledMark = {
  type: 'styled'
  attrs: StyledAttrs
}

export const parseStyledMark = object<StyledMark>({
  type: literal('styled'),
  attrs: parseStyledAttrs,
})

export type Mark =
  | ItalicMark
  | BoldMark
  | UnderlineMark
  | StrikethroughMark
  | SuperScriptMark
  | SubScriptMark
  | CodeMark
  | LinkMark
  | TextStyleMark
  | HighlightMark
  | StyledMark

export const parseMark = oneOf(
  parseItalicMark,
  parseBoldMark,
  parseUnderlineMark,
  parseStrikethroughMark,
  parseSuperScriptMark,
  parseSubScriptMark,
  parseCodeMark,
  parseLinkMark,
  parseTextStyleMark,
  parseHighlightMark,
  parseStyledMark,
)
