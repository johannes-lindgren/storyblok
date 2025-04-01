import {
  blockContent,
  type BlockContent,
  type TextContent,
  textContent,
} from '@storyblok/content'
import { array, equals, oneOf, type Parser } from 'pure-parse'

export type FeatureContent = BlockContent<{
  component: 'feature'
  name: TextContent
}>

export const parseFeatureContent = blockContent<FeatureContent>({
  component: equals('feature'),
  name: textContent(),
})

export type GridContent = BlockContent<{
  component: 'grid'
  columns: Content[]
}>

export const parseGridContent = blockContent<GridContent>({
  component: equals('grid'),
  columns: array(parseContent),
})

export type PageContent = BlockContent<{
  component: 'page'
  body: Content[]
}>

export const parsePageContent = blockContent<PageContent>({
  component: equals('page'),
  body: array(parseContent),
})

export type TeaserContent = BlockContent<{
  component: 'teaser'
  headline: TextContent
}>

export const parseTeaserContent = blockContent<TeaserContent>({
  component: equals('teaser'),
  headline: textContent(),
})

/**
 * @param data
 */
export function parseContent(data: unknown): ReturnType<Parser<Content>> {
  // This needs to be a function expression to avoid the following error:
  // TS2448: Block-scoped variable parseContent used before its declaration.
  return oneOf(
    parseFeatureContent,
    parseGridContent,
    parsePageContent,
    parseTeaserContent,
  )(data)
}

export type Content = FeatureContent | GridContent | PageContent | TeaserContent
