import {
  component,
  componentLibrary,
  optionField,
  textField,
  richTextField,
  contentParserFromLibrary,
  ContentFromLibrary,
  RichTextOptions,
} from '@johannes-lindgren/storyblok'

const richTextOptions: RichTextOptions = {
  styledOptions: {
    gradient: 'Gradient',
  },
}

const articleComponent = component({
  name: 'article',
  schema: {
    title: textField(),
    body: richTextField(richTextOptions),
  },
})

const admonitionComponent = component({
  name: 'admonition',
  schema: {
    type: optionField({
      options: {
        info: 'Info',
        tip: 'Tip',
        warning: 'Warning',
        danger: 'Danger',
      },
    }),
    body: richTextField(richTextOptions),
  },
})

/*
 * Construct a component library
 * This object will be serialized and pushed to Storyblok
 */

export const components = componentLibrary([
  articleComponent,
  admonitionComponent,
])

/*
 * ...or generate one
 */

export const parseContent = contentParserFromLibrary(components)

export type Content = ContentFromLibrary<typeof components>
