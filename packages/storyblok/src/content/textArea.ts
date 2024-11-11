import { Parser, parseString } from 'pure-parse'

export type TextAreaContent = string

export const parseTextAreaContent = (): Parser<TextAreaContent> => parseString
