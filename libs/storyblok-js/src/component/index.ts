// TODO incomplete description of components

export type StoryblokComponent = {
    name: string,
    id: number,
    schema: ComponentSchema,
}

export type ComponentSchema = Record<string, SchemaField>

export type SchemaField<SchemaType extends string = string> = {
    type: SchemaType,
    pos: number,
}
