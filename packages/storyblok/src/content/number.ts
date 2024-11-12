import { oneOf, parseNumber, Parser, success } from 'pure-parse'
import { parseNumberFromString } from './internals/parseNumberFromString'

export type NumberContent = number

// TODO default as option
export const numberContent = (): Parser<NumberContent> =>
  oneOf(parseNumber, parseNumberFromString, () => success(0))
