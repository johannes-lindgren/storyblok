import { parseBoolean, type Parser } from 'pure-parse'

export type BooleanContent = boolean

export const booleanContent = (): Parser<BooleanContent> => parseBoolean
