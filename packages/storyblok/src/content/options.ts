import { array, Parser } from 'pure-parse'
import { optionContent, OptionContent } from './option'

// TODO options as a parameter
const optionsContent = (): Parser<OptionContent[]> => array(optionContent())
