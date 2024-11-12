import { literal, Parser, parseString } from 'pure-parse'

export type OptionContent = string

export const optionContent = <Option extends OptionContent>(
  ...options: Option[]
): Parser<OptionContent> => literal(...options)
