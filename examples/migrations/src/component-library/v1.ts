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
    name: 'page@1',
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
  (typeof componentsV1)['page@1'],
  typeof componentsV1
>

export const parsePageContentV1 = contentParserFromComponent(
  componentsV1['page@1'],
  componentsV1,
)
