import { Component, ComponentLibrary } from '@johannes-lindgren/storyblok'
import {
  array,
  isUndefined,
  object,
  parseNumber,
  parseString,
} from 'pure-parse'
import { Credentials } from '../Credentials'
import { baseUrl } from './baseUrl'

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

export const getComponents = async (
  credentials: Credentials,
): Promise<RemoteComponent[]> => {
  const { spaceId, accessToken } = credentials
  const res = await fetch(`${baseUrl}/v1/spaces/${spaceId}/components`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${accessToken}`,
    },
  })

  const result = parseComponentsResponse(await res.json())

  if (result.tag === 'failure') {
    throw new Error('Failed to fetch components')
  }

  return result.value.components
}

export const putComponent = async (
  credentials: Credentials,
  component: Component,
  id: number,
) => {
  const { spaceId, accessToken } = credentials
  const res = await fetch(`${baseUrl}/v1/spaces/${spaceId}/components/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${accessToken}`,
    },
    body: JSON.stringify({
      component,
    }),
  })
  if (!res.ok) {
    throw new Error('Request failed')
  }
}

export const postComponent = async (
  credentials: Credentials,
  component: Component,
) => {
  const { spaceId, accessToken } = credentials
  const res = await fetch(`${baseUrl}/v1/spaces/${spaceId}/components`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${accessToken}`,
    },
    body: JSON.stringify({
      component,
    }),
  })
  if (!res.ok) {
    throw new Error('Request failed')
  }
}

/**
 * Pushes a local component library to the Storyblok space
 * @param credentials
 * @param components
 */
export const pushComponents = async (
  credentials: Credentials,
  components: ComponentLibrary,
) => {
  const remoteComponents = await getComponents(credentials)
  const componentName2Id = new Map(
    remoteComponents.map((component) => [component.name, component.id]),
  )

  const updateComponentTasks = Object.values(components).map((component) => {
    const id = componentName2Id.get(component.name)
    if (!isUndefined(id)) {
      return () => putComponent(credentials, component, id)
    } else {
      return () => postComponent(credentials, component)
    }
  })

  await Promise.all(updateComponentTasks.map((task) => task()))
}
