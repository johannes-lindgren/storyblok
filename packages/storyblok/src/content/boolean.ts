import { parseBoolean, withDefault } from 'pure-parse'

export type Boolean = boolean

// TODO default option
export const booleanContent = () => withDefault(parseBoolean, false)
