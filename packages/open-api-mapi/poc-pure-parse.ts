import { getRequest, GetRequest, object } from '@storyblok/openapi-schema'

type JsonSchema = {
  type: 'null'
} | {
  type: 'string'
} | {
  type: 'number'
} | {
  type: 'boolean'
} | {
  type: 'array'
  items: JsonSchema
} | {
  type: 'object'
  properties: Record<string, JsonSchema>
}
type JsonSchemaOf<T> =
const jsonSchema = <T>(schema: unknown) => () => schema

type StoryResponse = {
  stories: Story[]
}

type Story = {
  id: number
  title: string
  content: object
}

const storyResponseSchema = jsonSchema<StoryResponse>({
  stories: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        title: { type: 'string' },
        content: { type: 'object' },
      },
    },
  },
})

const getRequestSchema = getRequest<StoryResponse>({
  summary: 'Get stories',
  description: 'Get a list of stories',
  responses: {
    'application/json': {
      description: 'A list of stories',
      content: {
        'application/json': storyResponseSchema(),
      }
    }
  }
})
