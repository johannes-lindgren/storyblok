import { Component } from './component'
import { Simplify } from './internals'

export type ComponentLibrary = Record<string, Component>

export type ComponentLibraryFromList<T extends [...Component[]]> = Simplify<{
  [K in T[number]['name']]: Extract<T[number], { name: K }>
}>

export const componentLibrary = <const T extends [...Component[]]>(
  components: T,
): Simplify<ComponentLibraryFromList<T>> =>
  components.reduce(
    (acc, component) => {
      acc[component.name] = component
      return acc
    },
    {} as Record<string, Component>,
  ) as Simplify<ComponentLibraryFromList<T>>
