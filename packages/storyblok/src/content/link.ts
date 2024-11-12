import {
  literal,
  object,
  oneOf,
  optional,
  Parser,
  parseString,
} from 'pure-parse'

export type SharedLinkContent = {
  fieldtype: 'multilink'
  id: string
  url: string
  cached_url: string
  target?: '_blank' | '_self'
}

export type UrlLinkContent = {
  linktype: 'url'
} & SharedLinkContent

export type EmailLinkContent = {
  linktype: 'email'
  email?: string
} & SharedLinkContent

export type AssetLinkContent = {
  linktype: 'asset'
} & SharedLinkContent

export type StoryLinkContent = {
  linktype: 'story'
} & SharedLinkContent

const sharedLinkContentSchema = {
  fieldtype: literal('multilink'),
  id: parseString,
  url: parseString,
  cached_url: parseString,
  target: optional(literal('_blank', '_self')),
} as const

export const storyLinkContent = (): Parser<StoryLinkContent> =>
  object<StoryLinkContent>({
    linktype: literal('story'),
    ...sharedLinkContentSchema,
  })

export const urlLinkContent = (): Parser<UrlLinkContent> =>
  object<UrlLinkContent>({
    linktype: literal('url'),
    ...sharedLinkContentSchema,
  })

export const emailLinkContent = (): Parser<EmailLinkContent> =>
  object<EmailLinkContent>({
    linktype: literal('email'),
    ...sharedLinkContentSchema,
    email: optional(parseString),
  })

export const assetLinkContent = (): Parser<AssetLinkContent> =>
  object<AssetLinkContent>({
    linktype: literal('asset'),
    ...sharedLinkContentSchema,
  })
