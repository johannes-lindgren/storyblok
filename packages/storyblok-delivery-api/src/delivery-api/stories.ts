import { Credentials } from '../Credentials'
import { baseUrl } from './baseUrl'
import {
  literal,
  object,
  oneOf,
  parseBoolean,
  parseNumber,
  parseString,
  parseUnknown,
} from 'pure-parse'

export type Story = {
  id: number
  uuid: string
  name: string
  content: unknown
  parent_id: 0
  slug: string
  is_startpage: boolean
}

export const parseStory = object<Story>({
  id: parseNumber,
  uuid: parseString,
  name: parseString,
  content: parseUnknown,
  parent_id: literal(0),
  slug: parseString,
  is_startpage: parseBoolean,
})

type StoryResponse = {
  story: Story
}

export const parseStoryResponse = object<StoryResponse>({
  story: parseStory,
})

type Version = 'published' | 'draft'

type GetStoryParams =
  | {
      by: 'id'
      id: number
      version: Version
    }
  | {
      by: 'uuid'
      uuid: string
      version: Version
    }
  | {
      by: 'slug'
      slug: string
      version: Version
    }

export const getStory = async (
  credentials: Credentials,
  params: GetStoryParams,
): Promise<Story> => {
  const { accessToken } = credentials
  const slugOrIdOrUuid =
    params.by === 'slug'
      ? params.slug
      : params.by === 'id'
        ? params.id
        : params.uuid
  const urlSearchParams = new URLSearchParams({
    token: accessToken,
    version: params.version,
  }).toString()
  console.log('a', urlSearchParams)

  const res = await fetch(
    `${baseUrl}/v2/cdn/stories/${slugOrIdOrUuid}?${urlSearchParams.toString()}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )

  const result = parseStoryResponse(await res.json())

  if (result.tag === 'failure') {
    throw new Error('Failed to fetch components')
  }

  return result.value.story
}
