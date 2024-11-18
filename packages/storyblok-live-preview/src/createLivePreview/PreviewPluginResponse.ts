import { PreviewPluginData } from './PreviewPluginData'
import { PreviewPluginActions } from './PreviewPluginActions'

export type PreviewPluginResponse =
  | {
      type: 'loading'
      error?: never
      data?: never
      actions?: never
    }
  | {
      type: 'error'
      error: Error
      data?: never
      actions?: never
    }
  | {
      type: 'loaded'
      error?: never
      data: PreviewPluginData
      actions: PreviewPluginActions
    }
