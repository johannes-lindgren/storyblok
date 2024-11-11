import {
  booleanField,
  component,
  ContentFromComponent,
  contentParserFromComponent,
  numberField,
  textField,
} from '@johannes-lindgren/storyblok'

const pageComponentV1 = component({
  name: 'page',
  schema: {
    title: textField(),
    isPublic: booleanField(),
    padding: numberField(),
  },
})

const pageComponentV2 = component({
  name: 'page',
  schema: {
    title: textField(),
    isPublic: booleanField(),
    padding: textField(),
    // ^^^^^^ Changing the field type from number to text
  },
})

/*
 * You can define the parser yourself...
 */
type PageContentV1 = ContentFromComponent<typeof pageComponentV1>
type PageContentV2 = ContentFromComponent<typeof pageComponentV2>

const parsePageContentV1 = contentParserFromComponent(pageComponentV1)
const parsePageContentV2 = contentParserFromComponent(pageComponentV1)

// TODO actual implementation
const migration = createMigration({
  accessToken: 'your-access-token',
  spaceId: 0,
})

migration.migrate((payload) => {
  const res = parsePageContentV1(payload)
  if (res.tag === 'failure') {
    return {
      tag: 'failure',
      message: 'parsing of story failed',
    }
  }
  const oldStory: PageContentV1 = res.value
  const newStory: PageContentV2 = {
    ...oldStory,
    padding: `${oldStory.padding}`,
  }
  return {
    tag: 'success',
    value: newStory,
  }
})
