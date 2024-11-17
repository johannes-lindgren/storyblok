import { PreviewPluginMessageCallbacks } from './createPluginMessageListener'
import { isInputMessage } from '../../../messaging/previewMessage/containerToPreviewMessage'
import { isMessageToPreviewPlugin } from '../../../messaging/previewMessage/containerToPreviewMessage/MessageToPreviewPlugin'
import { isEnterEditModeMessage } from '../../../messaging/previewMessage/containerToPreviewMessage/EnterEditModeMessage'
import { isHoverComponentMessage } from '../../../messaging/previewMessage/containerToPreviewMessage/HoverComponentMessage'
import { isEnterComponentMessage } from '../../../messaging/previewMessage/containerToPreviewMessage/EnterComponentMessage'

export const handlePluginMessage = (
  data: unknown,
  callbacks: PreviewPluginMessageCallbacks,
) => {
  if (!isMessageToPreviewPlugin(data)) {
    // Other kind of event, which this function does not handle
    return
  }

  if (isInputMessage(data)) {
    callbacks.onInput(data)
  } else if (isEnterComponentMessage(data)) {
    callbacks.onEnterComponent(data)
  } else if (isEnterEditModeMessage(data)) {
    callbacks.onEnterEditMode(data)
  } else if (isHoverComponentMessage(data)) {
    callbacks.onHoverComponent(data)
  } else {
    callbacks.onUnknownMessage(data)
  }
}
