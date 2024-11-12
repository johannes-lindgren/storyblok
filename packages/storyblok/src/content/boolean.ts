import { parseBoolean } from 'pure-parse'

export type BooleanContent = boolean

// TODO default option
export const booleanContent = () => parseBoolean
