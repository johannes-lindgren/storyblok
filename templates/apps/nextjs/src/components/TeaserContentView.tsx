import { FunctionComponent } from 'react'
import { TeaserContent } from '@repo/content'

export const TeaserContentView: FunctionComponent<{
  content: TeaserContent
}> = (props) => {
  const { content } = props
  return (
    <div>
      <h2>{content.headline}</h2>
    </div>
  )
}
