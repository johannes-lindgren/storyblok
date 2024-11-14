import { Credentials } from '../Credentials'
import { baseUrl } from './baseUrl'
import {
  array,
  literal,
  object,
  oneOf,
  parseBoolean,
  parseNumber,
  parseString,
  parseUnknown,
} from 'pure-parse'

export type ContentStory = {
  is_folder: false
  id: number
  uuid: string
  name: string
  content: unknown
  parent_id: 0
  slug: string
  is_startpage: boolean
}

export const parseContentStory = object<ContentStory>({
  is_folder: literal(false),
  id: parseNumber,
  uuid: parseString,
  name: parseString,
  content: parseUnknown,
  parent_id: literal(0),
  slug: parseString,
  is_startpage: parseBoolean,
})

export type FolderStory = {
  is_folder: true
  id: number
  uuid: string
  name: string
  parent_id: 0
  slug: string
}

export const parseFolderStory = object<FolderStory>({
  is_folder: literal(true),
  id: parseNumber,
  uuid: parseString,
  name: parseString,
  parent_id: literal(0),
  slug: parseString,
})

export type Story = ContentStory | FolderStory

export const parseStory = oneOf(parseContentStory, parseFolderStory)

export type StoriesStory = Omit<Story, 'content'>

const parseStoriesStory = object<StoriesStory>({
  is_folder: parseBoolean,
  id: parseNumber,
  uuid: parseString,
  name: parseString,
  parent_id: literal(0),
  slug: parseString,
})

type StoriesResponse = {
  stories: StoriesStory[]
}

const parseStoriesResponse = object<StoriesResponse>({
  stories: array(parseStoriesStory),
})

export const getStories = async (
  params: Credentials,
): Promise<StoriesStory[]> => {
  const { spaceId, accessToken } = params
  // TODO pagination, throttling
  const res = await fetch(`${baseUrl}/v1/spaces/${spaceId}/stories`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${accessToken}`,
    },
  })

  const result = parseStoriesResponse(await res.json())

  if (result.tag === 'failure') {
    throw new Error('Failed to fetch components')
  }

  return result.value.stories
}

type StoryResponse = {
  story: Story
}

export const parseStoryResponse = object<StoryResponse>({
  story: parseStory,
})

export const getStory = async (
  params: Credentials,
  storyId: number,
): Promise<Story> => {
  const { spaceId, accessToken } = params
  const res = await fetch(
    `${baseUrl}/v1/spaces/${spaceId}/stories/${storyId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${accessToken}`,
      },
    },
  )

  const result = parseStoryResponse(await res.json())

  if (result.tag === 'failure') {
    throw new Error('Failed to fetch components')
  }

  return result.value.story
}

export const postStory = async (
  params: Credentials,
  story: Omit<Story, 'id' | 'uuid'>,
): Promise<void> => {
  const { spaceId, accessToken } = params
  const res = await fetch(`${baseUrl}/v1/spaces/${spaceId}/stories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${accessToken}`,
    },
    body: JSON.stringify({ story }),
  })
  if (!res.ok) {
    console.error(res)
    throw new Error('Request failed')
  }
}

export const putStory = async (
  params: Credentials,
  story: Omit<Story, 'id' | 'uuid'>,
  storyId: number,
): Promise<void> => {
  const { spaceId, accessToken } = params
  const res = await fetch(
    `${baseUrl}/v1/spaces/${spaceId}/stories/${storyId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${accessToken}`,
      },
      body: JSON.stringify({ story }),
    },
  )
  if (!res.ok) {
    console.error(res)
    throw new Error('Request failed')
  }
}

export const deleteStory = async (
  params: Credentials,
  id: Story['id'],
): Promise<void> => {
  const { spaceId, accessToken } = params
  const res = await fetch(`${baseUrl}/v1/spaces/${spaceId}/stories/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${accessToken}`,
    },
  })
  if (!res.ok) {
    console.error(res)
    throw new Error('Request failed')
  }
}

export const pushStories = async (
  credentials: Credentials,
  stories: Omit<Story, 'id' | 'uuid'>[],
) => {
  await Promise.all(stories.map((story) => postStory(credentials, story)))
}
