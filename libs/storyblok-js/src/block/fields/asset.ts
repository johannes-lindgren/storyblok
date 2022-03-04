
export type AssetData = ImageAssetData // TODO other asset types

export type ImageAssetData = GenericAssetData<"asset">

export type GenericAssetData<FieldType extends string> = {
    id: string | null,
    alt: string | null,
    name: string | null,
    focus: string | null,
    title: string | null,
    filename: string | null,
    copyright: string | null,
    fieldtype: FieldType
}