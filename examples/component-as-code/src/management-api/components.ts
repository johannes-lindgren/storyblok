import { Component } from '@johannes-lindgren/storyblok'
import {
  array,
  isUndefined,
  object,
  parseNumber,
  parseString,
} from 'pure-parse'

// TODO pass spaceId and mapiToken as arguments
const spaceId = parseInt(process.env.STORYBLOK_SPACE_ID || '')
const mapiToken = process.env.STORYBLOK_MANAGEMENT_API_TOKEN || ''

// TODO: calculate the base URL based on the spaceId
const baseUrl = 'https://mapi.storyblok.com'

export type RemoteComponent = {
  name: string
  id: number
}

const parseRemoteComponent = object<RemoteComponent>({
  name: parseString,
  id: parseNumber,
})

const parseComponentsResponse = object({
  components: array(parseRemoteComponent),
})

export const getComponents = async (): Promise<RemoteComponent[]> => {
  const res = await fetch(`${baseUrl}/v1/spaces/${spaceId}/components`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${mapiToken}`,
    },
  })

  const result = parseComponentsResponse(await res.json())

  if (result.tag === 'failure') {
    throw new Error('Failed to fetch components')
  }

  return result.value.components
}

export const putComponent = async (component: Component, id: number) => {
  await fetch(`${baseUrl}/v1/spaces/${spaceId}/components/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      component,
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${mapiToken}`,
    },
  })
}

export const postComponent = async (component: Component) => {
  await fetch(`${baseUrl}/v1/spaces/${spaceId}/components`, {
    method: 'POST',
    body: JSON.stringify({
      component,
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${mapiToken}`,
    },
  })
}

/**
 * Pushes a local component library to the Storyblok space
 * @param components
 */
export const pushComponents = async (components: Component[]) => {
  const remoteComponents = await getComponents()
  const componentName2Id = new Map(
    remoteComponents.map((component) => [component.name, component.id]),
  )

  const updateComponentTasks = components.map((component) => {
    const id = componentName2Id.get(component.name)
    if (!isUndefined(id)) {
      return () => putComponent(component, id)
    } else {
      return () => postComponent(component)
    }
  })

  await Promise.all(updateComponentTasks.map((task) => task()))
}
