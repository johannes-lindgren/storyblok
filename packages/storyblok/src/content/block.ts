import { object, Parser, parseString } from 'pure-parse'

export type BlockContent<
  T extends { component: string } = { component: string },
> = {
  _uid: string
} & T

export type BlockContentSchema<T extends BlockContent> = {
  // When you pick K from T, do you get an object with an optional property, which {} can be assigned to?
  [K in Exclude<keyof T, '_uid'>]: Parser<T[K]>
}

export const blockContent = <T extends BlockContent>(
  schema: BlockContentSchema<T>,
): Parser<T> =>
  object({
    _uid: parseString,
    ...schema,
  }) as Parser<T>
