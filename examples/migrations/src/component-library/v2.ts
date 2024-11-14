import {
  blocksField,
  booleanField,
  component,
  componentLibrary,
  ContentFromComponent,
  contentParserFromComponent,
  textField,
} from '@johannes-lindgren/storyblok'

export const componentsV2 = componentLibrary([
  component({
    name: 'page@2',
    schema: {
      title: textField(),
      isPublic: booleanField(),
      padding: textField(),
      // ^^^^^^ Changing the field type from number to text
      body: blocksField({ allowedComponents: [] }),
    },
  }),
])
export type PageContentV2 = ContentFromComponent<
  (typeof componentsV2)['page@2'],
  typeof componentsV2
>
export const parsePageContentV2 = contentParserFromComponent(
  componentsV2['page@2'],
  componentsV2,
)
