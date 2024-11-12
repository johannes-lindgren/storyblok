import { array, literal, oneOf, Parser, withDefault } from 'pure-parse'

import {
  BlocksField,
  Component,
  Field,
  OptionField,
  OptionsField,
} from './component'
import {
  booleanContent,
  textContent,
  numberContent,
  optionContent,
  optionsContent,
  AssetContent,
  assetContent,
  blockContent,
  BlockContentSchema,
} from './content'
import { ComponentLibrary } from './componentLibrary'

type Values<T extends unknown[]> = T[number]

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
    ? keyof Options
    : F extends OptionsField<infer Options>
      ? (keyof Options)[]
      : {
          text: string
          number: number
          boolean: boolean
          bloks: never
          asset: AssetContent | undefined
          multiasset: AssetContent[]
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
      return booleanContent() as Parser<ContentFromField<F, Components>>
    case 'text':
      return textContent() as Parser<ContentFromField<F, Components>>
    case 'number':
      return numberContent() as Parser<ContentFromField<F, Components>>
    case 'options':
      return optionsContent(...Object.keys(field.options)) as Parser<
        ContentFromField<F, Components>
      >
    case 'option':
      return optionContent(...Object.keys(field.options)) as Parser<
        ContentFromField<F, Components>
      >
    case 'bloks':
      // TODO this can cause infinite recursion
      return array(
        oneOf(
          ...Object.values(components)
            .filter((component) =>
              field.component_whitelist.includes(component.name),
            )
            .map((component) =>
              contentParserFromComponent(component, components),
            ),
        ),
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
