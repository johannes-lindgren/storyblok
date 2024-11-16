import {
  createElement,
  type CSSProperties,
  type FunctionComponent,
} from 'react'
import type { Content } from 'astro-app-components'
import type { RichTextContent } from '@johannes-lindgren/storyblok'
import type { HeadingNode, Mark, TextNode } from '@johannes-lindgren/storyblok'

export const ContentView: FunctionComponent<{
  content: Content
}> = (props) => {
  switch (props.content.component) {
    case 'article':
      return <ArticleView {...props} />
  }
}

export const ArticleView: FunctionComponent<{
  content: Extract<Content, { component: 'article' }>
}> = ({ content }) => {
  return (
    <article>
      {/*{JSON.stringify(content.body)}*/}
      <h1>{content.title}</h1>
      <RichTextView content={content.body} />
    </article>
  )
}

export const RichTextNodes: FunctionComponent<{
  content: RichTextContent[]
}> = (props) => props.content.map((node) => <RichTextView content={node} />)

export const RichTextView: FunctionComponent<{
  content: RichTextContent
}> = ({ content: node }) => {
  switch (node.type) {
    case 'doc': {
      return (
        <div>
          <RichTextNodes content={node.content} />
        </div>
      )
    }
    case 'paragraph': {
      return (
        <p>
          <RichTextNodes content={node.content} />
        </p>
      )
    }
    case 'text':
      return <TextNode content={node} />
    case 'image':
      return (
        <img
          src={node.attrs.src}
          alt={node.attrs.alt}
          title={node.attrs.title}
        />
      )
    case 'blockquote':
      return (
        <blockquote
          style={{
            borderLeft: '2px solid #ccc',
            paddingLeft: '1em',
            marginLeft: 0,
            marginRight: 0,
          }}
        >
          <RichTextNodes content={node.content} />
        </blockquote>
      )
    case 'horizontal_rule':
      return <hr />
    case 'heading':
      return <RichTextHeadingView content={node} />
    case 'code_block':
      return (
        <pre
          style={{
            padding: '0.5em',
            borderRadius: '10px',
            backgroundColor: '#f4f4f4',
            color: '#3A3A3A',
          }}
        >
          <code style={codeStyle}>
            <RichTextNodes content={node.content} />
          </code>
        </pre>
      )
    case 'bullet_list':
      return (
        <ul>
          {node.content.map((item) => (
            <li>
              <RichTextNodes content={item.content} />
            </li>
          ))}
        </ul>
      )
    case 'ordered_list':
      return (
        <ol>
          {node.content.map((item) => (
            <li>
              <RichTextNodes content={item.content} />
            </li>
          ))}
        </ol>
      )
    default:
      // Unknown node
      return undefined
  }
}

const TextNode: FunctionComponent<{ content: TextNode }> = ({ content }) => {
  return <span style={styleFromMarks(content.marks)}>{content.text}</span>
}

const codeStyle: CSSProperties = {
  fontFamily: 'monospace',
}

const styleFromMarks = (marks: Mark[]): CSSProperties =>
  marks.reduce((style, mark) => {
    style = { ...style, ...styleFromMark(mark) }
    return style
  }, {} as CSSProperties)

const styleFromMark = (mark: Mark): CSSProperties => {
  switch (mark.type) {
    case 'italic':
      return {
        fontStyle: 'italic',
      }
    case 'bold':
      return {
        fontWeight: 'bold',
      }
    case 'strike':
      return {
        textDecoration: 'line-through',
      }
    case 'code':
      return codeStyle
    case 'underline':
      return {
        textDecoration: 'underline',
      }
    case 'subscript':
      return {
        verticalAlign: 'sub',
      }
    case 'superscript':
      return {
        verticalAlign: 'super',
      }
    default:
      return {}
  }
}

const RichTextHeadingView: FunctionComponent<{ content: HeadingNode }> = ({
  content,
}) =>
  createElement(richTextNodeToElement(content), {
    children: <RichTextNodes content={content.content} />,
  })

const richTextNodeToElement = (
  node: HeadingNode,
): 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' => {
  switch (node.attrs.level) {
    case 1:
      return 'h1'
    case 2:
      return 'h2'
    case 3:
      return 'h3'
    case 4:
      return 'h4'
    case 5:
      return 'h5'
    default:
      return 'h6'
  }
}
