import { Parser, parseString } from 'pure-parse'

export type TextContent = string

export const textContent = (): Parser<TextContent> => parseString
