import { Credentials } from '@johannes-lindgren/storyblok-migrations'

export const credentialsFromEnvironment = (): Credentials => {
  const spaceId = parseInt(process.env.STORYBLOK_SPACE_ID || '')
  const accessToken = process.env.STORYBLOK_MANAGEMENT_API_TOKEN || undefined

  if (isNaN(spaceId)) {
    throw new Error('Invalid space id')
  }
  if (!accessToken) {
    throw new Error('Missing management api token')
  }
  return {
    spaceId,
    accessToken,
  }
}
