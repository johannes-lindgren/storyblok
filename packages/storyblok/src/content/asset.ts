import {
  failure,
  isString,
  literal,
  object,
  parseNumber,
  Parser,
  parseString,
  success,
  undefineable,
} from 'pure-parse'
import { parseNumberFromString } from './internals/parseNumberFromString'

export type AssetContent = {
  fieldtype: 'asset'
  id: number
  filename: string
  title: string | undefined
  alt: string | undefined
  copyright: string | undefined
  focus: [number, number] | undefined
}

const parseFocus: Parser<[number, number]> = (data) => {
  if (!isString(data)) {
    return failure('Expected string')
  }
  const [_, x, y] = /^([0-9]*)x([0-9]*)/.exec(data) || []
  const xRes = parseNumberFromString(x)
  const yRes = parseNumberFromString(y)
  if (xRes.tag === 'failure' || yRes.tag === 'failure') {
    return failure(`Could not parse focus from string: ${data}`)
  }
  return success([xRes.value, yRes.value])
}

export const assetContent = () =>
  object<AssetContent>({
    fieldtype: literal('asset'),
    id: parseNumber,
    filename: parseString,
    title: undefineable(parseString),
    alt: undefineable(parseString),
    copyright: undefineable(parseString),
    focus: undefineable(parseFocus),
  })
