// TODO incomplete description of components

export type Component = {
    name: string
    id: number
    schema: ComponentSchema
}

export type ComponentSchema = Record<string, SchemaField>

export type FieldType = ''
// bloks
// text
// textarea
// markdown
// number
// datetime
// boolean
// options
// option
// image
// file
// multiasset
// multilink
// section
// custom

export type SchemaField<SchemaType extends string= string> = {
    type: SchemaType
}

export type TextField = SchemaField<'text'>
export type BlocksField = SchemaField<'bloks'>
export type TextAreaField = SchemaField<'textarea'>
export type RichTextField = SchemaField<'richtext'>
export type MarkdownField = SchemaField<'markdown'>
export type NumberField = SchemaField<'number'>
export type OptionsField = SchemaField<'options'>
export type AssetField = SchemaField<'asset'>
export type MultiAssetField = SchemaField<'multiasset'>
export type MultiLinkField = SchemaField<'multilink'>
export type TableField = SchemaField<'table'>
export type SectionGroupField = SchemaField<'section'>
export type DateTimeField = SchemaField<'datetime'>
export type CustomField = SchemaField<'custom'>
