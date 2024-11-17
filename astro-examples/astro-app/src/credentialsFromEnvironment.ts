import { type Credentials } from '@johannes-lindgren/storyblok-delivery-api'

export const credentialsFromEnvironment = (): Credentials => {
  const accessToken = import.meta.env.STORYBLOK_DELIVERY_API_TOKEN || undefined

  if (!accessToken) {
    throw new Error('Missing management api token')
  }
  return {
    accessToken,
  }
}
