import { prepareSpace } from '../prepare'
import { credentialsFromEnvironment } from '../credentialsFromEnvironment'
import { ContentStory } from '@johannes-lindgren/storyblok-migrations'
import { components } from 'astro-app-components'
import { ContentFromLibrary } from '@johannes-lindgren/storyblok'

const initialStories: Omit<ContentStory, 'id' | 'uuid'>[] = [
  {
    is_folder: false,
    name: 'A New Blog',
    slug: 'a-new-story',
    content: {
      _uid: 'abc-123',
      component: 'article',
      title: 'A New Blog',
      body: { type: 'doc', content: [] },
    } satisfies ContentFromLibrary<typeof components>,
    parent_id: 0,
    is_startpage: false,
  },
]

await prepareSpace(credentialsFromEnvironment(), components, initialStories)
