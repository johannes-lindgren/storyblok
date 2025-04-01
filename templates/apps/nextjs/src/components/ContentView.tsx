import { FunctionComponent } from 'react'
import { Content } from '@repo/content'
import { PageContentView } from '@/components/PageContentView'
import { TeaserContentView } from '@/components/TeaserContentView'
import { FeatureContentView } from '@/components/FeatureContentView'
import { GridContentView } from '@/components/GridContentView'

export const ContentView: FunctionComponent<{
  content: Content
}> = (props) => {
  const { content } = props
  switch (content.component) {
    case 'feature':
      return <FeatureContentView content={content} />
    case 'grid':
      return <GridContentView content={content} />
    case 'page':
      return <PageContentView content={content} />
    case 'teaser':
      return <TeaserContentView content={content} />
    default:
      return undefined
  }
}
