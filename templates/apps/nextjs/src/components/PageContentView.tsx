import { FunctionComponent } from 'react'
import { PageContent } from '@repo/content'
import { ContentView } from '@/components/ContentView'

export const PageContentView: FunctionComponent<{
  content: PageContent
}> = (props) => {
  const { content } = props
  return (
    <div>
      {content.body.map((content, index) => (
        <ContentView key={index} content={content} />
      ))}
    </div>
  )
}
