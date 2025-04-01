import { type Parser, parseString } from 'pure-parse'

export type TextAreaContent = string

export const textAreaContent = (): Parser<TextAreaContent> => parseString
