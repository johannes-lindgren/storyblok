import { BlocksField, Component, Field } from '../component'
import { array, literal, object, oneOf, Parser, parseString } from 'pure-parse'
import { booleanContent } from './boolean'
import { textContent } from './text'
import { numberContent } from './number'

type Values<T extends unknown[]> = T[number]

export type ContentFromField<
  F extends Field,
  Components extends Record<string, Component>,
> = F extends BlocksField<infer ComponentNames>
  ? {
      [ComponentName in Values<ComponentNames>]: ContentFromComponent<
        Components[ComponentName],
        Components
      >
    }[Values<ComponentNames>][]
  : {
      text: string
      number: number
      boolean: boolean
      // Handled in the other branch of the ternary
      bloks: never
    }[F['type']]

export type ContentFromComponent<
  C extends Component,
  Components extends Record<string, Component>,
> = {
  [K in keyof C['schema']]: ContentFromField<C['schema'][K], Components>
} & {
  _uid: string
  component: C['name']
}

const contentParserFromField = <
  F extends Field,
  Components extends Record<string, Component>,
>(
  field: F,
  components: Components,
): Parser<ContentFromField<F, Components>> => {
  switch (field.type) {
    case 'boolean':
      return booleanContent() as Parser<ContentFromField<F, Components>>
    case 'text':
      return textContent() as Parser<ContentFromField<F, Components>>
    case 'number':
      return numberContent() as Parser<ContentFromField<F, Components>>
    case 'bloks':
      return array(
        oneOf(
          ...Object.values(components).map((component) =>
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
  Components extends Record<string, Component>,
>(
  component: C,
  components: Components,
): Parser<Simplify<ContentFromComponent<C, Components>>> =>
  // @ts-ignore
  object<ContentFromComponent<C>>({
    _uid: parseString,
    component: literal(component.name),
    schema: Object.fromEntries(
      Object.entries(component.schema).map(([key, field]) => [
        key,
        contentParserFromField(field, components),
      ]),
    ),
  })

/**
 * Takes a complex type expression and simplifies it to a plain object. Useful when inferring types.
 */
export type Simplify<T> = T extends infer _ ? { [K in keyof T]: T[K] } : never
