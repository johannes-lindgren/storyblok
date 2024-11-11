import { Parser, parseString } from 'pure-parse'

export type MarkdownContent = string

export const markdownContent = (): Parser<MarkdownContent> => parseString
