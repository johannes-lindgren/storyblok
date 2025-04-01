import {
  equals,
  object,
  parseNumber,
  type Parser,
  parseString,
  undefineable,
} from 'pure-parse'

export type AssetContent = {
  fieldtype: 'asset'
  id: number
  filename: string
  title: string | undefined
  alt: string | undefined
  copyright: string | undefined
  focus: string | undefined
}

export const assetContent = (): Parser<AssetContent> =>
  object<AssetContent>({
    fieldtype: equals('asset'),
    id: parseNumber,
    filename: parseString,
    title: undefineable(parseString),
    alt: undefineable(parseString),
    copyright: undefineable(parseString),
    focus: undefineable(parseString),
  })
