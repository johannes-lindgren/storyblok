import { createPluginActions } from './createPluginActions'
import { PreviewPluginResponse } from './PreviewPluginResponse'
import { createPluginMessageListener } from './createPluginActions/createPluginMessageListener'

export type CreatePreviewPlugin = (
  onUpdate: (state: PreviewPluginResponse) => void,
) => () => void

/**
 * @returns cleanup function for side effects
 */
export const createLivePreview: CreatePreviewPlugin = (onUpdateState) => {
  const isEmbedded = window.parent !== window

  if (!isEmbedded) {
    onUpdateState({
      type: 'error',
      error: new Error(`The window is not embedded within another window`),
    })
    return () => undefined
  }

  const postToContainer = (message: unknown) => {
    // TODO specify https://app.storyblok.com/ in production mode, * in dev mode
    const origin = '*'
    window.parent.postMessage(message, origin)
  }

  const { actions, messageCallbacks } = createPluginActions(
    postToContainer,
    (data) => {
      onUpdateState({
        type: 'loaded',
        data,
        actions,
      })
    },
  )
  actions.setPluginReady()

  return createPluginMessageListener(messageCallbacks)
}
