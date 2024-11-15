import { oneOf, parseNumber, Parser, parseString, success } from 'pure-parse'
import { parseNumberFromString } from './internals/parseNumberFromString'

export type NumberContent = string

// TODO default as option
export const numberContent = (): Parser<NumberContent> => parseString

/**
 * Parse number content as a number. Numbers are encoded in decimal format as strings.
 */
export const numberContentAsNumber = (): Parser<number> =>
  oneOf(parseNumber, parseNumberFromString)
