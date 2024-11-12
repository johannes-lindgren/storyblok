import { literal, Parser } from 'pure-parse'

export type OptionContent<T extends string = never> = T

export const optionContent = <Option extends OptionContent<string>>(
  ...options: Option[]
): Parser<Option> => literal(...options)
