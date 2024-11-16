import {
  assetField,
  assetsField,
  blocksField,
  booleanField,
  component,
  componentLibrary,
  ContentFromComponent,
  contentParserFromComponent,
  numberField,
  optionField,
  optionsField,
  textField,
  richTextField,
  contentParserFromLibrary,
  ContentFromLibrary,
} from '@johannes-lindgren/storyblok'

const articleComponent = component({
  name: 'article',
  schema: {
    title: textField(),
    body: richTextField(),
  },
})

/*
 * Construct a component library
 * This object will be serialized and pushed to Storyblok
 */

export const components = componentLibrary([articleComponent])

/*
 * ...or generate one
 */

export const parseContent = contentParserFromLibrary(components)

export type Content = ContentFromLibrary<typeof components>
