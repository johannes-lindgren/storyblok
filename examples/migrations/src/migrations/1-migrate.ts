import { createMigration } from '@johannes-lindgren/storyblok-migrations'
import { credentialsFromEnvironment } from '../credentialsFromEnvironment'
import { componentsV1, componentsV2 } from '../lib/main'

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
