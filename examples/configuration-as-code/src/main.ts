import {
  booleanField,
  component,
  numberField,
  textField,
  contentParserFromComponent,
  blocksField,
  optionField,
  optionsField,
} from '@johannes-lindgren/storyblok'
import { pushComponents } from './management-api'
import { Infer } from 'pure-parse'

const heroComponent = component({
  name: 'hero',
  schema: {
    title: textField(),
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
  },
})

const pageComponent = component({
  name: 'page',
  schema: {
    title: textField(),
    isPublic: booleanField(),
    padding: numberField(),
    body: blocksField({
      allowedComponents: [heroComponent.name, galleryComponent.name, 'page'],
    }),
  },
})

/*
 * The component library
 * Will be serialized and uploaded to Storyblok
 */

const components = {
  page: pageComponent,
  hero: heroComponent,
  gallery: galleryComponent,
} as const

/*
 * ...or generate one
 */

// TODO prevent infinite recursion
const parsePageContent = contentParserFromComponent(pageComponent, components)

type PageContent = Infer<typeof parsePageContent>
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
      align: 'center',
      padded: ['left', 'top', 'right'],
    },
    {
      _uid: 'aadfsd',
      component: 'gallery',
      columnCount: 3,
    },
    {
      _uid: 'aadfsd',
      component: 'page',
      title: 'Subpage',
      padding: 10,
      isPublic: true,
      body: [
        {
          _uid: 'saa',
          component: 'hero',
          title: 'hello!',
          align: 'left',
          padded: ['bottom'],
        },
      ],
    },
  ],
}

await pushComponents(Object.values(components))
console.log('Done')
