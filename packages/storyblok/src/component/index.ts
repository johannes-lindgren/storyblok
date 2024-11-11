export type TextField = {
  type: 'text'
}

export type NumberField = {
  type: 'number'
}

export type BlocksField<ComponentNames extends string[]> = {
  type: 'bloks'
  restrict_components: true
  component_whitelist: ComponentNames
}

export type BooleanField = {
  type: 'boolean'
}

export type Field =
  | TextField
  | BooleanField
  | NumberField
  | BlocksField<string[]>

export type BlockSchema = Record<string, Field>

export type Schema = BlockSchema

export type Component = {
  name: string
  schema: Schema
}

export const textField = (): TextField => ({
  type: 'text',
})

export const numberField = (): NumberField => ({
  type: 'number',
})

export const booleanField = (): BooleanField => ({
  type: 'boolean',
})

export const blocksField = <const ComponentNames extends string[]>(options: {
  allowedComponents: ComponentNames
}): BlocksField<ComponentNames> => ({
  type: 'bloks',
  restrict_components: true,
  component_whitelist: options.allowedComponents,
})

export const component = <const T extends Component>(component: T): T =>
  component
