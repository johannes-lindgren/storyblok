import { equals, oneOf, type Parser } from 'pure-parse'

export type OptionContent<T extends string = never> = T

export const optionContent = <Option extends OptionContent<string>>(
  options: Option[],
): Parser<Option> => oneOf(...options.map((it) => equals(it)))
