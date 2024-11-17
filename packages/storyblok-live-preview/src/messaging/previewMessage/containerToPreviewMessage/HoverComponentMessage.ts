import { isMessageToPreviewPlugin } from './MessageToPreviewPlugin'

export type HoverComponentMessage = {
  action: 'hoverComponent'
  componentId: string | null
  storyId: string
}

export const isHoverComponentMessage = (
  data: unknown,
): data is HoverComponentMessage =>
  isMessageToPreviewPlugin(data) && data.action === 'hoverComponent'
