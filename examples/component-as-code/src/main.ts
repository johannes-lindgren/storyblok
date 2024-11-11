import {
  booleanField,
  component,
  numberField,
  textField,
  contentParserFromComponent,
  blocksField,
} from '@johannes-lindgren/storyblok'
import { pushComponents } from './management-api'
import { Infer } from 'pure-parse'

const heroComponent = component({
  name: 'hero',
  schema: {
    title: textField(),
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

const components = {
  page: pageComponent,
  hero: heroComponent,
  gallery: galleryComponent,
} as const

/*
 * ...or generate one
 */

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
        },
      ],
    },
  ],
}

await pushComponents(Object.values(components))
console.log('Done')
