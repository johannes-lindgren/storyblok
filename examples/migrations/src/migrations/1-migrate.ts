import { createMigration } from '@johannes-lindgren/storyblok-migrations'
import { credentialsFromEnvironment } from '../credentialsFromEnvironment'
import { componentsV1 } from '../component-library/v1'
import { componentsV2 } from '../component-library/v2'

const migrate = createMigration({
  credentials: credentialsFromEnvironment(),
  from: componentsV1,
  to: componentsV2,
})

await migrate((oldStory) => {
  return {
    ...oldStory,
    padding: `${oldStory.padding}px`,
  }
})
