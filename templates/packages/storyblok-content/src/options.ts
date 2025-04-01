import { array, type Parser } from 'pure-parse'
import { optionContent, type OptionContent } from './option'

export type OptionsContent = string[]

export const optionsContent = <Option extends OptionContent<string>>(
  options: Option[],
): Parser<Option[]> => array(optionContent(options))
