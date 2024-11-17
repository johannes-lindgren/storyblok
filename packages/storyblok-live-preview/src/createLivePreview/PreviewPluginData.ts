/**
 * Type that describes the complete state of a field type
 */
import { Story } from '../messaging'

export type PreviewPluginData = {
  story: Story
  enteredBlockUid: string | undefined
  hoveredBlockUid: string | undefined
}
