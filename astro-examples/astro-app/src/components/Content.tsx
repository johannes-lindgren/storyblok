import {
  createElement,
  type CSSProperties,
  type FunctionComponent,
} from 'react'
import { type Content, parseContent } from 'astro-app-components'
import type { RichTextContent } from '@johannes-lindgren/storyblok'
import type { HeadingNode, Mark, TextNode } from '@johannes-lindgren/storyblok'
import type { StyledMark } from '@johannes-lindgren/storyblok'
import { contentAttributes } from './LivePreview.tsx'

export const ContentView: FunctionComponent<{
  content: Content
}> = ({ content }) => {
  switch (content.component) {
    case 'article':
      return <ArticleView content={content} />
    case 'admonition':
      return <AdmonitionView content={content} />
  }
}

export const AdmonitionView: FunctionComponent<{
  content: Extract<Content, { component: 'admonition' }>
}> = ({ content }) => {
  const type = content.type ?? 'info'
  return (
    <div style={admonitionStyle(type)} {...contentAttributes(content)}>
      <h3
        style={{
          margin: 0,
        }}
      >
        {admonitionTitle(type)}
      </h3>
      <RichTextView content={content.body} />
    </div>
  )
}

const admonitionTitle = (
  type: Exclude<
    Extract<Content, { component: 'admonition' }>['type'],
    undefined
  >,
): string => {
  switch (type) {
    case 'info':
      return 'Info'
    case 'tip':
      return 'Tip'
    case 'warning':
      return 'Warning'
    case 'danger':
      return 'Danger'
  }
}

const admonitionStyle = (
  type: Exclude<
    Extract<Content, { component: 'admonition' }>['type'],
    undefined
  >,
): CSSProperties => {
  const sharedStyles: CSSProperties = {
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingTop: '10px',
    paddingBottom: '10px',
    borderRadius: '5px',
    display: 'flex',
    flexDirection: 'column',
    border: ' 1px solid rgba(var(--accent-light), 25%)',
    margin: '10px 0',
  }
  const gradient = (color: string) =>
    `linear-gradient(rgba(var(${color}), 15%), rgba(var(${color}), 10%))`
  switch (type) {
    case 'info':
      return {
        background: gradient('--color-info'),
        ...sharedStyles,
      }
    case 'tip':
      return {
        background: gradient('--color-success'),
        ...sharedStyles,
      }
    case 'warning':
      return {
        background: gradient('--color-warning'),
        ...sharedStyles,
      }
    case 'danger':
      return {
        background: gradient('--color-error'),
        ...sharedStyles,
      }
  }
}

export const ArticleView: FunctionComponent<{
  content: Extract<Content, { component: 'article' }>
}> = ({ content }) => {
  return (
    <article {...contentAttributes(content)}>
      {/*<h1>{content.title}</h1>*/}
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
        <p style={{ margin: '0.75em 0' }}>
          <RichTextNodes content={node.content} />
        </p>
      )
    }
    case 'text':
      return <TextNode content={node} />
    case 'image':
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <img
            src={node.attrs.src}
            alt={node.attrs.alt}
            title={node.attrs.title}
          />
        </div>
      )
    case 'blockquote':
      return (
        <blockquote
          style={{
            borderLeft: '2px solid #ccc',
            paddingLeft: '1em',
            marginLeft: 0,
            marginRight: 0,
            borderColor: 'rgb(var(--accent-light))',
            color: 'rgb(var(--accent-light))',
          }}
        >
          <RichTextNodes content={node.content} />
        </blockquote>
      )
    case 'horizontal_rule':
      return (
        <hr
          style={{
            borderColor: 'rgb(var(--accent-light))',
          }}
        />
      )
    case 'heading':
      return <RichTextHeadingView content={node} />
    case 'code_block':
      return (
        <pre
          style={{
            padding: '10px 20px',
            borderRadius: '5px',
            border: '1px solid rgba(var(--accent-light), 25%)',
            ...codeStyle,
          }}
        >
          <code>
            <RichTextNodes content={node.content} />
          </code>
        </pre>
      )
    case 'bullet_list':
      return (
        <ul style={{ margin: '10px 0' }}>
          {node.content.map((item) => (
            <li>
              <RichTextNodes content={item.content} />
            </li>
          ))}
        </ul>
      )
    case 'ordered_list':
      return (
        <ol style={{ margin: '10px 0' }}>
          {node.content.map((item) => (
            <li>
              <RichTextNodes content={item.content} />
            </li>
          ))}
        </ol>
      )
    case 'blok':
      return (
        <div>
          {node.attrs.body.map((content) => {
            const res = parseContent(content)
            if (res.tag === 'failure') {
              // Failed to parse content
              return undefined
            }
            return <ContentView content={res.value} />
          })}
        </div>
      )
    default:
      // Unknown node
      return undefined
  }
}

const TextNode: FunctionComponent<{ content: TextNode }> = ({ content }) => {
  const linkMark = content.marks.find((mark) => mark.type === 'link')
  if (!linkMark) {
    return <span style={styleFromMarks(content.marks)}>{content.text}</span>
  }
  const linkAttrs = linkMark.attrs
  switch (linkAttrs.linktype) {
    case 'url':
      return (
        <a
          href={linkAttrs.href}
          target="_blank"
          rel="noopener noreferrer"
          style={styleFromMarks(content.marks)}
        >
          {content.text}
        </a>
      )
    case 'story':
      return (
        <a href={linkAttrs.href} style={styleFromMarks(content.marks)}>
          {content.text}
        </a>
      )
    case 'email':
      return (
        <a
          href={`mailto:${linkAttrs.href}`}
          style={styleFromMarks(content.marks)}
        >
          {content.text}
        </a>
      )
    case 'asset':
      return (
        <a href={linkAttrs.href} style={styleFromMarks(content.marks)}>
          {content.text}
        </a>
      )
    default:
      return <span>{content.text}</span>
  }
}

const codeStyle: CSSProperties = {
  fontFamily: 'monospace',
  background: 'rgba(var(--accent-light), 12%)',
  color: 'rgb(var(--accent-light))',
}

const styleFromMarks = (marks: Mark[]): CSSProperties =>
  marks.reduce((style, mark) => {
    style = { ...style, ...styleFromMark(mark) }
    return style
  }, {} as CSSProperties)

const inlineHighlightStyle: CSSProperties = {
  fontSize: '0.8em',
  padding: '0.3em 0.4em',
  borderRadius: '5px',
}

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
      return {
        ...inlineHighlightStyle,
        ...codeStyle,
      }
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
    case 'textStyle':
      return {
        color: mark.attrs.color,
      }
    case 'highlight':
      return {
        ...inlineHighlightStyle,
        backgroundColor: mark.attrs.color,
      }
    case 'link':
      return {
        color: 'rgb(var(--accent-light))',
      }
    case 'styled':
      return styleFromStyledMark(mark)
    default:
      return {}
  }
}

const styleFromStyledMark = (mark: StyledMark): CSSProperties => {
  switch (mark.attrs.class) {
    case 'gradient':
      return {
        backgroundImage: 'var(--accent-gradient)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundSize: '400%',
        backgroundPosition: '0%',
      }
    default:
      return {}
  }
}

const RichTextHeadingView: FunctionComponent<{ content: HeadingNode }> = ({
  content,
}) =>
  createElement(richTextNodeToElement(content), {
    style: styleFromHeadingNode(content),
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

const styleFromHeadingNode = (node: HeadingNode): CSSProperties => {
  const sharedStyles: CSSProperties = {
    fontWeight: 700,
    lineHeight: 1,
    marginBottom: '1em',
    margin: '0.67em 0',
  }
  switch (node.attrs.level) {
    case 1:
      return {
        fontSize: '4em',
        textAlign: 'center',
        ...sharedStyles,
      }
    case 2:
      return {
        fontSize: '2em',
        ...sharedStyles,
      }
    case 3:
      return {
        fontSize: '1.17em',
        ...sharedStyles,
      }
    case 4:
      return {
        fontSize: '1em',
        ...sharedStyles,
      }
    case 5:
      return {
        fontSize: '0.83em',
        ...sharedStyles,
      }
    default:
      return {
        fontSize: '0.67em',
        ...sharedStyles,
      }
  }
}
