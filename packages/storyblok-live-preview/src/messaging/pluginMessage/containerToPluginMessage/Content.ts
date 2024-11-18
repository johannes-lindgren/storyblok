import { hasKey } from '../../../utils'

export type Content = {
  component: string
  _uid: string
}

export const isContent = (data: unknown): data is Content =>
  hasKey(data, 'component') &&
  typeof data.component === 'string' &&
  hasKey(data, '_uid') &&
  typeof data._uid === 'string'
