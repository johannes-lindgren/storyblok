/**
 * Takes a complex type expression and simplifies it to a plain object. Useful when inferring types.
 */
export type Simplify<T> = T extends infer _ ? { [K in keyof T]: T[K] } : never
