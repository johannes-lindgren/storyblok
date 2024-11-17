import { Credentials } from '../Credentials'
import { baseUrl } from './baseUrl'
import {
  literal,
  object,
  oneOf,
  parseBoolean,
  parseNumber,
  Parser,
  parseString,
  ParseSuccess,
  parseUnknown,
  success,
} from 'pure-parse'

export type Link = {
  is_folder: false
  id: number
  uuid: string
  name: string
  slug: string
  is_startpage: boolean
}

export const parseLink = object<Link>({
  is_folder: literal(false),
  id: parseNumber,
  uuid: parseString,
  name: parseString,
  slug: parseString,
  is_startpage: parseBoolean,
})

type LinksResponse = {
  links: Record<string, Link>
}

export const parseLinksResponse = object<LinksResponse>({
  // @ts-ignore -- TODO in pure-parse: implement record parser
  links: parseUnknown,
})

export const getLinks = async (credentials: Credentials): Promise<Link[]> => {
  const { accessToken } = credentials
  const urlSearchParams = new URLSearchParams({ token: accessToken }).toString()
  const res = await fetch(`${baseUrl}/v2/cdn/links?${urlSearchParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const result = parseLinksResponse(await res.json())

  if (result.tag === 'failure') {
    throw new Error('Failed to fetch components')
  }

  return Object.values(result.value.links)
}
