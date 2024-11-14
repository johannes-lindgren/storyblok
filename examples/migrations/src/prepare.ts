import {
  Credentials,
  deleteStory,
  forEachStory,
  postStory,
  Story,
  pushComponents,
} from '@johannes-lindgren/storyblok-migrations'
import { ComponentLibrary } from '@johannes-lindgren/storyblok'
import { ContentStory } from '@johannes-lindgren/storyblok-migrations'

/**
 * Prepare a space with initial content to demo migrations.
 * @param credentials
 * @param initialComponents
 * @param initialStories
 */
export const prepareMigrationsDemoSpace = async (
  credentials: Credentials,
  initialComponents: ComponentLibrary,
  initialStories: Omit<ContentStory, 'id' | 'uuid'>[],
) => {
  console.log('Starting preparing space...')

  console.log('Deleting all stories...')
  await deleteAllStories(credentials)
  console.log('Finished deleting all stories.')

  console.log('Starting pushing initial components...')
  await pushComponents(credentials, initialComponents)
  console.log('Finished pushing initial components.')

  console.log('Starting pushing initial content...')
  await pushContent(credentials, initialStories)
  console.log('Finished pushing initial content.')

  console.log('Finished preparing.')
}

const deleteAllStories = async (credentials: Credentials) => {
  await forEachStory(credentials, (story) => deleteStory(credentials, story.id))
}

const pushContent = async (
  credentials: Credentials,
  stories: Omit<Story, 'id' | 'uuid'>[],
) => {
  await Promise.all(stories.map((story) => postStory(credentials, story)))
}
