import {
  ComponentLibrary,
  ContentFromLibrary,
  contentParserFromLibrary,
  componentLibrary,
  Component,
} from '@johannes-lindgren/storyblok'
import { Credentials } from '../Credentials'
import {
  getStories,
  StoriesStory,
  getStory,
  putStory,
  pushComponents,
  getComponents,
  RemoteComponent,
  putSpace,
} from '../management-api'

export type MigrationConfig<
  OldLibrary extends ComponentLibrary,
  NewLibrary extends ComponentLibrary,
> = {
  from: OldLibrary
  to: NewLibrary
  credentials: Credentials
}

/**
 * Use this migration when you update a component, and you want to migrate all content on a per-story basis.
 * @param config
 */
export const createMigration =
  <OldLibrary extends ComponentLibrary, NewLibrary extends ComponentLibrary>(
    config: MigrationConfig<OldLibrary, NewLibrary>,
  ) =>
  async (
    migrateStory: (
      oldStory: ContentFromLibrary<OldLibrary>,
    ) => ContentFromLibrary<NewLibrary>,
  ) => {
    const { credentials, from, to } = config

    console.log('Starting migrating component library...')
    await pushComponents(credentials, to)
    console.log('Finished migrating component library.')

    const parseContentV1 = contentParserFromLibrary(from)

    console.log('Starting migrating content...')
    forEachStory(credentials, async (storyV1) => {
      if (storyV1.is_folder) {
        return
      }
      const storyWithContent = await getStory(credentials, storyV1.id)
      if (storyWithContent.is_folder) {
        // Should not happen, but needed for type inference
        return
      }
      const contentV1 = parseContentV1(storyWithContent.content)
      if (contentV1.tag === 'failure') {
        return
      }
      const contentV2 = migrateStory(contentV1.value)
      const storyV2 = {
        ...storyV1,
        content: contentV2,
      }
      await putStory(credentials, storyV2, storyV2.id)
    })
    console.log('Finished migrating content.')
  }

export const forEachStory = async (
  credentials: Credentials,
  callback: (story: StoriesStory) => Promise<void>,
) => {
  const stories = await getStories(credentials)
  await Promise.all(stories.map(callback))
}

export const forEachComponent = async (
  credentials: Credentials,
  callback: (story: RemoteComponent) => Promise<void>,
) => {
  const stories = await getComponents(credentials)
  await Promise.all(stories.map(callback))
}
