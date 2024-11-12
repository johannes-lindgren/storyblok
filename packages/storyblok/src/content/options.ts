import { array, Parser } from 'pure-parse'
import { optionContent, OptionContent } from './option'

export const optionsContent = <Option extends OptionContent>(
  ...options: Option[]
): Parser<OptionContent[]> => array(optionContent(...options))
