import { isMessageToPreviewPlugin } from './MessageToPreviewPlugin'

export type EnterEditModeMessage = {
  action: 'enterEditmode'
  reload: boolean
  blockId: string
  storyId: string
  componentNames: Record<string, string>
  appVersion: string
}

export const isEnterEditModeMessage = (
  data: unknown,
): data is EnterEditModeMessage =>
  isMessageToPreviewPlugin(data) && data.action === 'enterEditmode'
