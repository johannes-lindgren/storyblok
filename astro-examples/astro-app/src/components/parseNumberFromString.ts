import { failure, isString, type Parser, success } from 'pure-parse'

/**
 * Parses a number from a string without any suprises. Strings that describe numbers (without any other characters involved) yield
 * `number`. All other combinations of characters yield `undefined`.
 */
const numberFromString = (str: string): number | undefined => {
  const parsed = Number(str)
  return str !== '' && !hasWhiteSpace(str) && !isNaN(parsed) && isFinite(parsed)
    ? parsed
    : undefined
}

/**
 * @param str
 * @returns `true` if any character is whitespace.
 */
const hasWhiteSpace = (str: string): boolean => {
  return /\s+/.test(str)
}

export const parseNumberFromString: Parser<number> = (data) => {
  if (!isString(data)) {
    return failure('Expected a string')
  }
  const res = numberFromString(data)
  if (res === undefined) {
    return failure('Could not parse a number from the string')
  }
  return success(res)
}
