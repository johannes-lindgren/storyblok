import { Credentials } from '@johannes-lindgren/storyblok-migrations'
import { components } from 'astro-app-components'
import { wipeAndInitSpace } from './init'
import { initialStories } from './content'
import { object, parseNumber, parseString } from 'pure-parse'

type RequestHandler = (request: Request) => Promise<Response>

const tryRequest =
  (handler: RequestHandler): RequestHandler =>
  async (request) => {
    try {
      return await handler(request)
    } catch (error) {
      return Response.json(
        {
          error: 'internal_server_error',
        },
        { status: 500 },
      )
    }
  }

type RequestBody = {
  spaceId: number
  accessToken: string
}

const parseRequestBody = object<RequestBody>({
  spaceId: parseNumber,
  accessToken: parseString,
})

export const POST: RequestHandler = tryRequest(async (request) => {
  const body = parseRequestBody(await request.json())

  if (body.tag === 'failure') {
    return Response.json(
      { error: 'invalid_request_body', message: body.error },
      { status: 400 },
    )
  }

  const credentials: Credentials = {
    spaceId: body.value.spaceId,
    accessToken: body.value.accessToken,
  }

  await wipeAndInitSpace(credentials, components, initialStories)
  return Response.json({ message: 'Success' }, { status: 200 })
})
