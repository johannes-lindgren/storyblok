import { Parser, parseString } from 'pure-parse'

export type OptionContent = string

// TODO options as a parameter
export const optionContent = (): Parser<OptionContent> => parseString
