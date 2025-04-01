import { type Parser, parseString } from 'pure-parse'

type DateContent = string

export const dateContent = (): Parser<DateContent> => parseString

// TODO parse into a Date object
// TODO support the option "disable time selection"
