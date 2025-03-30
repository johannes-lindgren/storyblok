import {
  ContentStory,
  Credentials,
  deleteComponent,
  deleteStory,
  forEachComponent,
  forEachStory,
  PreviewLocation,
  pushComponents,
  pushStories,
  putSpace,
  RemoteComponent,
} from '@johannes-lindgren/storyblok-migrations'
import {
  component,
  componentLibrary,
  ComponentLibrary,
} from '@johannes-lindgren/storyblok'

/**
 * Clears a space of all content and components, then pushes initial components and stories.
 * TODO set default component
 * @param credentials
 * @param initialComponents
 * @param initialStories
 */
export const wipeAndInitSpace = async (
  credentials: Credentials,
  initialComponents: ComponentLibrary,
  initialStories: Omit<ContentStory, 'id' | 'uuid'>[],
) => {
  console.log('Starting preparing space...')

  console.log('Creating dummy default component...')
  const defaultComponentName = await initDefaultComponent(credentials)
  console.log('Finished creating dummy default component.')

  console.log('Deleting all components...')
  await deleteAllComponents(credentials, defaultComponentName)
  console.log('Finished deleting all components.')

  console.log('Deleting all stories...')
  await deleteAllStories(credentials)
  console.log('Finished deleting all stories.')

  console.log('Starting pushing initial components...')
  await pushComponents(credentials, initialComponents)
  console.log('Finished pushing initial components.')

  console.log('Starting pushing initial content...')
  await pushStories(credentials, initialStories)
  console.log('Finished pushing initial content.')

  console.log('Creating previews...')
  await initPreviews(credentials, [
    {
      name: 'Dev',
      location: 'http://localhost:4321',
    },
  ])
  console.log('Finished creating previews.')

  console.log('Finished preparing.')
}

/**
 * Each space has a default component that cannot be deleted.
 * Therefore, to clean up the space, create a dummy default component.
 * @param credentials
 */
const initDefaultComponent = async (
  credentials: Credentials,
): Promise<RemoteComponent['name']> => {
  const defaultComponentName = 'default_dummy'
  const dummyLib = componentLibrary([
    component({
      name: defaultComponentName,
      schema: {},
    }),
  ])
  await pushComponents(credentials, dummyLib)
  await setDefaultComponent(credentials, defaultComponentName)
  return defaultComponentName
}

const setDefaultComponent = async (
  credentials: Credentials,
  defaultComponentName: RemoteComponent['name'],
) => {
  await putSpace(
    credentials,
    { default_root: defaultComponentName },
    credentials.spaceId,
  )
}

/**
 * Ensure that the passed location is https and ends with a trailing slash
 * @param location
 */
const parseLocation = (location: string): string => {
  const url = new URL(location)
  url.protocol = 'https:'
  console.log('in', location)
  console.log('out', url.toString())
  return url.toString()
}

const initPreviews = async (
  credentials: Credentials,
  previews: [PreviewLocation, ...PreviewLocation[]],
): Promise<void> => {
  await putSpace(
    credentials,
    {
      domain: parseLocation(previews[0].location),
      encode_preview_urls: true,
      environments: previews.map((preview) => ({
        ...preview,
        location: parseLocation(preview.location),
      })),
    },
    credentials.spaceId,
  )
}

const deleteAllStories = async (credentials: Credentials) => {
  await forEachStory(credentials, (story) => deleteStory(credentials, story.id))
}

/**
 *
 * @param credentials
 * @param defaultComponentName the name of the default component, which cannot be deleted.
 */
const deleteAllComponents = async (
  credentials: Credentials,
  defaultComponentName: RemoteComponent['name'],
) => {
  await forEachComponent(credentials, async (component) => {
    if (component.name === defaultComponentName) {
      return
    }
    await deleteComponent(credentials, component.id)
  })
}
