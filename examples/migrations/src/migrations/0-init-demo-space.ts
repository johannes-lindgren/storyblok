import { prepareMigrationsDemoSpace } from '../prepare'
import { credentialsFromEnvironment } from '../credentialsFromEnvironment'
import { componentsV1, PageContentV1 } from '../component-library/v1'
import { ContentStory } from '@johannes-lindgren/storyblok-migrations'

const initialStories: Omit<ContentStory, 'id' | 'uuid'>[] = [
  {
    is_folder: false,
    name: 'A New Blog',
    slug: 'a-new-story',
    content: {
      _uid: 'abc-123',
      component: 'page@1',
      title: 'A New Blog',
      padding: (10).toString(),
      isPublic: true,
      body: [],
    } satisfies PageContentV1,
    parent_id: 0,
    is_startpage: false,
  },
]

await prepareMigrationsDemoSpace(
  credentialsFromEnvironment(),
  componentsV1,
  initialStories,
)
