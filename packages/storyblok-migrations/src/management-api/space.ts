import { Credentials } from '../Credentials'
import { baseUrl } from './baseUrl'

export type Space = {
  id: number
  name: string
  default_root: string
}

export const putSpace = async (
  params: Credentials,
  space: Partial<Omit<Space, 'id' | 'uuid'>>,
  id: Space['id'],
): Promise<void> => {
  const { spaceId, accessToken } = params
  const res = await fetch(`${baseUrl}/v1/spaces/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${accessToken}`,
    },
    body: JSON.stringify({ space }),
  })
  if (!res.ok) {
    console.error(res)
    throw new Error('Request failed')
  }
}
