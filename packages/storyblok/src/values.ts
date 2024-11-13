export type Values<T extends unknown[] | Record<string, unknown>> =
  T extends unknown[] ? T[number] : T[keyof T]
