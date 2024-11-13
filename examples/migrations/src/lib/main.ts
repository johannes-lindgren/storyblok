import {
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
    },
  }),
])

export const componentsV2 = componentLibrary([
  component({
    name: 'page',
    schema: {
      title: textField(),
      isPublic: booleanField(),
      padding: textField(),
      // ^^^^^^ Changing the field type from number to text
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

export type PageContentV2 = ContentFromComponent<
  typeof componentsV2.page,
  typeof componentsV1
>

export const parsePageContentV1 = contentParserFromComponent(
  componentsV1.page,
  componentsV1,
)
export const parsePageContentV2 = contentParserFromComponent(
  componentsV2.page,
  componentsV2,
)
