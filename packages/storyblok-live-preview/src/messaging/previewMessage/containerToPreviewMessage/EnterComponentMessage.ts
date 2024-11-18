import { isMessageToPreviewPlugin } from './MessageToPreviewPlugin'

export type EnterComponentMessage = {
  action: 'enterComponent'
  componentId: string
  storyId: string
}
export const isEnterComponentMessage = (
  data: unknown,
): data is EnterComponentMessage =>
  isMessageToPreviewPlugin(data) && data.action === 'enterComponent'
