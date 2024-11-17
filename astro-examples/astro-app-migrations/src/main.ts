import { credentialsFromEnvironment } from './credentialsFromEnvironment'
import { pushComponents } from '@johannes-lindgren/storyblok-migrations'
import { components } from 'astro-app-components'

const credentials = credentialsFromEnvironment()
await pushComponents(credentials, components)
