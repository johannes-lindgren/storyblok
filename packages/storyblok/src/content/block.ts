import { object, Parser, parseString } from 'pure-parse'

export type BlockContent<T extends { component: string }> = {
  _uid: string
} & T

export const blockContent = <
  T extends { _uid: string; component: string },
>(schema: {
  // When you pick K from T, do you get an object with an optional property, which {} can be assigned to?
  [K in Exclude<keyof T, '_uid'>]: Parser<T[K]>
}): Parser<T> =>
  // @ts-ignore
  object<T>({
    _uid: parseString,
    ...schema,
  })
