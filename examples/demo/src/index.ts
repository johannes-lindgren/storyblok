import {
  booleanContent,
  textContent,
  BlockContent,
  blockContent,
  AssetContent,
  assetContent,
  OptionContent,
  optionContent,
  storyLinkContent,
  StoryLinkContent,
  component,
  componentLibrary,
  optionField,
  textField,
  contentParserFromLibrary,
  ContentFromLibrary,
  assetField,
  booleanField,
  blocksField,
} from '@johannes-lindgren/storyblok'
import { array, literal, oneOf, withDefault } from 'pure-parse'
import {
  Credentials,
  pushComponents,
} from '@johannes-lindgren/storyblok-migrations'

/**
 * Step 1: provide types
 */

type HeroContent = BlockContent<{
  component: 'hero'
  image: AssetContent | undefined
  buttonLink: StoryLinkContent | undefined
  buttonType: OptionContent<'primary' | 'secondary'>
}>

type PageContent = BlockContent<{
  component: 'page'
  title: string
  isPublic: boolean
  body: Array<HeroContent>
}>

/**
 * Step 2: provide parsers
 */

const parseHeroContent = blockContent<HeroContent>({
  component: literal('hero'),
  image: withDefault(assetContent(), undefined),
  buttonLink: withDefault(storyLinkContent(), undefined),
  buttonType: withDefault(optionContent('primary', 'secondary'), 'primary'),
})

const parsePageContent = blockContent<PageContent>({
  component: literal('page'),
  isPublic: withDefault(booleanContent(), false),
  title: withDefault(textContent(), ''),
  body: withDefault(array(oneOf(parseHeroContent)), []),
})

/**
 * Step 3: Components as Code
 */

const heroComponent = component({
  name: 'hero',
  schema: {
    image: assetField({
      filetypes: ['images', 'videos'],
    }),
    buttonType: optionField({
      options: {
        primary: 'Primary',
        secondary: 'Secondary',
      },
    }),
  },
})

const pageComponent = component({
  name: 'page',
  schema: {
    title: textField(),
    isPublic: booleanField(),
    body: blocksField({
      allowedComponents: ['hero'],
    }),
  },
})

export const components = componentLibrary([pageComponent, heroComponent])

export const parseContent = contentParserFromLibrary(components)
export type Content = ContentFromLibrary<typeof components>

/**
 * Step 4: Use a new client to upload the components
 */

if (!process.env.SPACE_ID || !process.env.OAUTH_TOKEN) {
  throw new Error('Please provide SPACE_ID and OAUTH_TOKEN')
}

const credentials: Credentials = {
  spaceId: Number(process.env.SPACE_ID),
  accessToken: process.env.OAUTH_TOKEN,
}

await pushComponents(credentials, components)

/**
 * Step 5: Component Versioning
 */

/**
 * Step 6: Migrations
 */
