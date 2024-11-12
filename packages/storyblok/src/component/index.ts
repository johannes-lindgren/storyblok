export type BlocksField<ComponentNames extends string[] = string[]> = {
  type: 'bloks'
  restrict_components: true
  component_whitelist: ComponentNames
}

export type TextField = {
  type: 'text'
}

export type TextAreaField = {
  type: 'textarea'
}

export type RichTextField = {
  type: 'richtext'
}

export type NumberField = {
  type: 'number'
}

export type BooleanField = {
  type: 'boolean'
}

export type OptionField<
  Options extends Record<string, string> = Record<string, string>,
> = {
  type: 'option'
  source: 'self'
  options: Options
}

export type ReferenceField = {
  type: 'option'
  source: 'internal_stories'
}

export type OptionsField<
  Options extends Record<string, string> = Record<string, string>,
> = {
  type: 'options'
  source: 'self'
  options: Options
}

export type ReferencesField = {
  type: 'options'
  source: 'internal_stories'
}

export type Field =
  | TextField
  | BooleanField
  | NumberField
  | BlocksField
  | OptionField
  | OptionsField

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

export const optionField = <Options extends Record<string, string>>(options: {
  options: Options
}): OptionField<Options> => ({
  type: 'option',
  source: 'self',
  options: options.options,
})

export const optionsField = <Options extends Record<string, string>>(options: {
  options: Options
}): OptionsField<Options> => ({
  type: 'options',
  source: 'self',
  options: options.options,
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
