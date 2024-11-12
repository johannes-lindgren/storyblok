import {
  booleanField,
  component,
  numberField,
  textField,
  blocksField,
  optionField,
  optionsField,
  assetField,
  assetsField,
  ContentFromComponent,
  contentParserFromComponent,
  componentLibrary,
} from '@johannes-lindgren/storyblok'
import { pushComponents } from './management-api'

const heroComponent = component({
  name: 'hero',
  schema: {
    title: textField(),
    background: assetField({ filetypes: ['images'] }),
    align: optionField({
      options: {
        left: 'Left',
        center: 'Center',
        right: 'Right',
      },
    }),
    padded: optionsField({
      options: {
        left: 'Left',
        right: 'Right',
        top: 'Top',
        bottom: 'Bottom',
      },
    }),
  },
})

const galleryComponent = component({
  name: 'gallery',
  schema: {
    columnCount: numberField(),
    images: assetsField({ filetypes: ['images'] }),
  },
})

const pageComponent = component({
  name: 'page',
  schema: {
    title: textField(),
    isPublic: booleanField(),
    padding: numberField(),
    body: blocksField({
      allowedComponents: [heroComponent.name, galleryComponent.name],
    }),
  },
})

/*
 * Construct a component library
 * This object will be serialized and pushed to Storyblok
 */

const components = componentLibrary([
  pageComponent,
  heroComponent,
  galleryComponent,
])

/*
 * ...or generate one
 */

const parsePageContent = contentParserFromComponent(pageComponent, components)

type PageContent = ContentFromComponent<typeof pageComponent, typeof components>
const page: PageContent = {
  _uid: '123',
  component: 'page',
  title: 'Hello, World!',
  padding: 10,
  isPublic: true,
  body: [
    {
      _uid: 'aadfsd',
      component: 'hero',
      title: 'Hero',
      background: undefined,
      align: 'center',
      padded: ['left', 'top', 'right'],
    },
    {
      _uid: 'aadfsd',
      component: 'gallery',
      columnCount: 3,
      images: [],
    },
  ],
}

await pushComponents(components)
console.log('Done')
