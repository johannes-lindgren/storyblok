import { array, literal, oneOf, Parser, withDefault } from 'pure-parse'

import {
  BlocksField,
  Component,
  Field,
  OptionField,
  OptionsField,
} from './component'
import {
  AssetContent,
  assetContent,
  blockContent,
  BlockContentSchema,
  booleanContent,
  numberContent,
  optionContent,
  optionsContent,
  RichTextContent,
  richTextContent,
  textContent,
} from './content'
import { ComponentLibrary } from './componentLibrary'
import { Values } from './values'

export type ContentFromField<
  F extends Field,
  Components extends ComponentLibrary,
> = F extends BlocksField<infer ComponentNames>
  ? {
      [ComponentName in Values<ComponentNames>]: ContentFromComponent<
        Components[ComponentName],
        Components
      >
    }[Values<ComponentNames>][]
  : F extends OptionField<infer Options>
    ? keyof Options | undefined
    : F extends OptionsField<infer Options>
      ? (keyof Options)[]
      : {
          text: string
          number: string
          boolean: boolean
          bloks: never
          asset: AssetContent | undefined
          multiasset: AssetContent[]
          richtext: RichTextContent
          // Handled in the other branch of the ternary; story references
          option: never
          options: never
          // Handled in the other branch of the ternary
        }[F['type']]

export type ContentFromComponent<
  C extends Component,
  Components extends ComponentLibrary,
> = {
  [K in keyof C['schema']]: ContentFromField<C['schema'][K], Components>
} & {
  _uid: string
  component: C['name']
}

const contentParserFromField = <
  F extends Field,
  Components extends ComponentLibrary,
>(
  field: F,
  components: Components,
): Parser<ContentFromField<F, Components>> => {
  switch (field.type) {
    case 'asset':
      return withDefault(assetContent(), undefined) as Parser<
        ContentFromField<F, Components>
      >
    case 'multiasset':
      return withDefault(array(assetContent()), []) as Parser<
        ContentFromField<F, Components>
      >
    case 'boolean':
      return withDefault(booleanContent(), false) as Parser<
        ContentFromField<F, Components>
      >
    case 'text':
      return withDefault(textContent(), '') as Parser<
        ContentFromField<F, Components>
      >
    case 'number':
      return withDefault(numberContent(), '0') as Parser<
        ContentFromField<F, Components>
      >
    case 'option':
      return withDefault(
        optionContent(...field.options.map((option) => option.value)),
        undefined,
      ) as Parser<ContentFromField<F, Components>>
    case 'options':
      return withDefault(
        optionsContent(...field.options.map((option) => option.value)),
        [],
      ) as Parser<ContentFromField<F, Components>>
    case 'richtext':
      return withDefault(richTextContent(), {
        type: 'doc',
        content: [],
      }) as Parser<ContentFromField<F, Components>>
    case 'bloks':
      // TODO this can cause infinite recursion
      return withDefault(
        array(
          oneOf(
            ...Object.values(components)
              .filter((component) =>
                field.component_whitelist.includes(component.name),
              )
              .map((component) =>
                contentParserFromComponent(component, components),
              ),
          ),
        ),
        [],
      ) as Parser<ContentFromField<F, Components>>
  }
}

/**
 * Generate a parser from a component
 */
export const contentParserFromComponent = <
  C extends Component,
  Components extends ComponentLibrary,
>(
  component: C,
  components: Components,
): Parser<ContentFromComponent<C, Components>> =>
  blockContent<ContentFromComponent<C, Components>>(
    Object.entries(component.schema).reduce(
      (acc, [key, field]) => {
        // @ts-expect-error
        acc[key] = contentParserFromField(field, components)
        return acc
      },
      { component: literal(component.name) } as BlockContentSchema<
        ContentFromComponent<C, Components>
      >,
    ),
  ) as Parser<ContentFromComponent<C, Components>>
