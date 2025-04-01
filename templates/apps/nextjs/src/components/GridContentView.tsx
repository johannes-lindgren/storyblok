import { FunctionComponent } from 'react'
import { GridContent } from '@repo/content'
import { ContentView } from '@/components/ContentView'

export const GridContentView: FunctionComponent<{
  content: GridContent
}> = (props) => {
  const { content } = props
  return (
    <div>
      {content.columns.map((content, index) => (
        <ContentView key={index} content={content} />
      ))}
    </div>
  )
}
