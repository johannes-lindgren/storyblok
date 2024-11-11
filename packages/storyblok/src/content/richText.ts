// TODO: Add more types
import { array, literal, object, Parser } from 'pure-parse'

export type RichTextContent = {
  type: 'doc'
  content: RichTextContent[]
}

// TODO options as a parameter
export const richTextContent = (): Parser<RichTextContent> =>
  object<RichTextContent>({
    type: literal('doc'),
    content: array(richTextContent()),
  })
