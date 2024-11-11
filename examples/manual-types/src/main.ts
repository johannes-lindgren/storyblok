import { array, literal, oneOf, withDefault } from 'pure-parse'
import {
  booleanContent,
  numberContent,
  textContent,
  BlockContent,
  blockContent,
  LinkContent,
  linkContent,
  AssetContent,
  assetContent,
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
  buttonLink: LinkContent | undefined
  buttonType: 'primary' | 'secondary'
}>

type GridContent = BlockContent<{
  component: 'grid'
  columns: number
}>

const parseHeroContent = blockContent<HeroContent>({
  component: literal('hero'),
  image: withDefault(assetContent(), undefined),
  buttonLink: withDefault(linkContent(), undefined),
  buttonType: withDefault(literal('primary', 'secondary'), 'primary'),
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
