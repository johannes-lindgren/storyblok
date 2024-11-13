import { prepareMigrationsDemoSpace } from '../prepare'
import { credentialsFromEnvironment } from '../credentialsFromEnvironment'
import { componentsV1, PageContentV1 } from '../lib/main'

await prepareMigrationsDemoSpace(credentialsFromEnvironment(), componentsV1, [
  {
    is_folder: false,
    name: 'A New Blog',
    slug: 'a-new-story',
    content: {
      component: 'page',
      title: 'A New Blog',
      padding: '10',
      isPublic: true,
      body: [],
    } satisfies PageContentV1,
    parent_id: 0,
  },
])
