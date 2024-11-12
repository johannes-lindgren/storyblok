import { array, Parser } from 'pure-parse'
import { optionContent, OptionContent } from './option'

export const optionsContent = <Option extends OptionContent<string>>(
  ...options: Option[]
): Parser<Option[]> => array(optionContent(...options))
