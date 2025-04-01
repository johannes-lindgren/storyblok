import { equals, object, optional, type Parser, parseString } from 'pure-parse'

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
  fieldtype: equals('multilink'),
  id: parseString,
  url: parseString,
  cached_url: parseString,
  target: optional(equals('_blank', '_self')),
} as const

export const storyLinkContent = (): Parser<StoryLinkContent> =>
  object<StoryLinkContent>({
    linktype: equals('story'),
    ...sharedLinkContentSchema,
  })

export const urlLinkContent = (): Parser<UrlLinkContent> =>
  object<UrlLinkContent>({
    linktype: equals('url'),
    ...sharedLinkContentSchema,
  })

export const emailLinkContent = (): Parser<EmailLinkContent> =>
  object<EmailLinkContent>({
    linktype: equals('email'),
    ...sharedLinkContentSchema,
    email: optional(parseString),
  })

export const assetLinkContent = (): Parser<AssetLinkContent> =>
  object<AssetLinkContent>({
    linktype: equals('asset'),
    ...sharedLinkContentSchema,
  })
