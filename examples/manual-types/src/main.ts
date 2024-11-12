import { array, literal, oneOf, withDefault } from 'pure-parse'
import {
  booleanContent,
  numberContent,
  textContent,
  BlockContent,
  blockContent,
  AssetContent,
  assetContent,
  OptionContent,
  optionContent,
  storyLinkContent,
  StoryLinkContent,
} from '@johannes-lindgren/storyblok'

type PageContent = BlockContent<{
  component: 'page'
  title: string
  isPublic: boolean
  body: Array<HeroContent | GridContent>
}>

type HeroContent = BlockContent<{
  component: 'hero'
  image: AssetContent | undefined
  buttonLink: StoryLinkContent | undefined
  buttonType: OptionContent<'primary' | 'secondary'>
}>

type GridContent = BlockContent<{
  component: 'grid'
  columns: number
}>

const parseHeroContent = blockContent<HeroContent>({
  component: literal('hero'),
  image: withDefault(assetContent(), undefined),
  buttonLink: withDefault(storyLinkContent(), undefined),
  buttonType: withDefault(optionContent('primary', 'secondary'), 'primary'),
})

const parseGridContent = blockContent<GridContent>({
  component: literal('grid'),
  columns: withDefault(numberContent(), 3),
})

const parsePageContent = blockContent<PageContent>({
  component: literal('page'),
  isPublic: withDefault(booleanContent(), false),
  title: withDefault(textContent(), ''),
  body: withDefault(array(oneOf(parseHeroContent, parseGridContent)), []),
})
