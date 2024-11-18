import { handlePluginMessage } from './handlePluginMessage'
import { OnMessage } from '../../../messaging'
import { InputMessage } from '../../../messaging/previewMessage/containerToPreviewMessage'
import { MessageToPreviewPlugin } from '../../../messaging/previewMessage/containerToPreviewMessage/MessageToPreviewPlugin'
import { EnterEditModeMessage } from '../../../messaging/previewMessage/containerToPreviewMessage/EnterEditModeMessage'
import { HoverComponentMessage } from '../../../messaging/previewMessage/containerToPreviewMessage/HoverComponentMessage'
import { EnterComponentMessage } from '../../../messaging/previewMessage/containerToPreviewMessage/EnterComponentMessage'

export type PreviewPluginMessageCallbacks = {
  onInput: OnMessage<InputMessage>
  onEnterComponent: OnMessage<EnterComponentMessage>
  onEnterEditMode: OnMessage<EnterEditModeMessage>
  onHoverComponent: OnMessage<HoverComponentMessage>
  onUnknownMessage: OnMessage<MessageToPreviewPlugin<string>>
}

export type CreatePluginMessageListener = (
  callbacks: PreviewPluginMessageCallbacks,
) => () => void

/**
 * Has side effects!
 * Returns a cleanup function that unregisters effects.
 */
export const createPluginMessageListener: CreatePluginMessageListener = (
  callbacks,
) => {
  const handleEvent = (event: MessageEvent<unknown>) => {
    handlePluginMessage(event.data, callbacks)
  }
  window.addEventListener('message', handleEvent, false)

  return () => {
    window.removeEventListener('message', handleEvent, false)
  }
}
