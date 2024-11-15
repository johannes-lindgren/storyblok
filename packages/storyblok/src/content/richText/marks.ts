import { literal, object, oneOf } from 'pure-parse'

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
  href: literal('string'),
})

export type StoryLinkAttrs = {
  linktype: 'story'
  href: string
  uuid: string
}

export const parseStoryLinkAttrs = object<StoryLinkAttrs>({
  linktype: literal('story'),
  href: literal('string'),
  uuid: literal('string'),
})

export type EmailLinkAttrs = {
  linktype: 'email'
  href: string
}

export const parseEmailLinkAttrs = object<EmailLinkAttrs>({
  linktype: literal('email'),
  href: literal('string'),
})

export type AssetLinkAttrs = {
  linktype: 'asset'
  href: string
}

export const parseAssetLinkAttrs = object<AssetLinkAttrs>({
  linktype: literal('asset'),
  href: literal('string'),
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

export type Mark =
  | ItalicMark
  | BoldMark
  | UnderlineMark
  | StrikethroughMark
  | SuperScriptMark
  | SubScriptMark
  | CodeMark
  | LinkMark

export const parseMark = oneOf(
  parseItalicMark,
  parseBoldMark,
  parseUnderlineMark,
  parseStrikethroughMark,
  parseSuperScriptMark,
  parseSubScriptMark,
  parseCodeMark,
  parseLinkMark,
)
