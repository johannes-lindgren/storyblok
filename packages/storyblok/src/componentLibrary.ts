import { Component } from './component'
import { Simplify } from './internals'
import {
  ContentFromComponent,
  contentParserFromComponent,
} from './contentParserFromComponent'
import { Values } from './values'
import { oneOf, Parser } from 'pure-parse'

export type ComponentLibrary = {
  [Key in string]: Component & { name: Key }
}

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

export type ContentFromLibrary<Components extends ComponentLibrary> = Values<{
  [K in keyof Components]: ContentFromComponent<Components[K], Components>
}>

export const contentParserFromLibrary = <Components extends ComponentLibrary>(
  components: Components,
): Parser<ContentFromLibrary<Components>> => {
  const parsers = Object.values(components).map((component) =>
    contentParserFromComponent(component, components),
  )
  return oneOf(...parsers) as Parser<ContentFromLibrary<Components>>
}
