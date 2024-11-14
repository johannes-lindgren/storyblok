import {
  blocksField,
  booleanField,
  component,
  componentLibrary,
  ContentFromComponent,
  contentParserFromComponent,
  numberField,
  textField,
} from '@johannes-lindgren/storyblok'

export const componentsV1 = componentLibrary([
  component({
    name: 'page',
    schema: {
      title: textField(),
      isPublic: booleanField(),
      padding: numberField(),
      body: blocksField({ allowedComponents: [] }),
    },
  }),
])

/*
 * You can define the parser yourself...
 */
export type PageContentV1 = ContentFromComponent<
  typeof componentsV1.page,
  typeof componentsV1
>

export const parsePageContentV1 = contentParserFromComponent(
  componentsV1.page,
  componentsV1,
)
