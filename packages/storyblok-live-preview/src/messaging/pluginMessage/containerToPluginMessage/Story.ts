import { hasKey } from '../../../utils'
import { Content, isContent } from './Content'

/**
 * The story object that is attached to "get-context", "loaded".
 */
export type Story = {
  content: Content
  lang?: 'default' | string
} & Record<string, unknown>

// TODO validate content
export const isStoryData = (data: unknown): data is Story =>
  hasKey(data, 'content') &&
  isContent(data.content) &&
  !Array.isArray(data.content) &&
  (!hasKey(data, 'lang') ||
    (hasKey(data, 'lang') && typeof data.lang === 'string'))
