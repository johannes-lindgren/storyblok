import { FunctionComponent } from 'react'
import { FeatureContent } from '@repo/content'

export const FeatureContentView: FunctionComponent<{
  content: FeatureContent
}> = (props) => {
  const { content } = props
  return (
    <div>
      <h1>{content.name}</h1>
    </div>
  )
}
