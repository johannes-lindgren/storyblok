
export type Asset = ImageAsset // TODO other asset types

export type ImageAsset = GenericAsset<"asset">

export type GenericAsset<FieldType extends string> = {
    id: string | null,
    alt: string | null,
    name: string | null,
    focus: string | null,
    title: string | null,
    filename: string | null,
    copyright: string | null,
    fieldtype: FieldType
}